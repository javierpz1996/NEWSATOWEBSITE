import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLE_NAME = "cart_submissions";
const SCHEMA_NAME = "public";

type CartLine = {
  label?: string;
  priceUsd?: number;
};

type CartItem = {
  serviceTitle?: string;
  totalUsd?: number;
  lines?: CartLine[];
};

type CartSubmissionRecord = {
  id: string;
  client_name?: string | null;
  social_network?: string;
  social_username?: string;
  payment_method?: string | null;
  notes?: string | null;
  items?: CartItem[];
  total_usd?: number | string;
};

type DatabaseWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: CartSubmissionRecord | null;
  old_record: CartSubmissionRecord | null;
};

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function formatUsd(value: number | string | undefined): string {
  if (value === undefined || value === null || value === "") return "—";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  return `$${n.toFixed(2)}`;
}

function formatItemsSummary(items: CartItem[] | undefined): string {
  if (!items?.length) return "—";

  const lines: string[] = [];
  for (const item of items) {
    const title = item.serviceTitle ?? "Servicio";
    lines.push(`• **${truncate(title, 80)}** — ${formatUsd(item.totalUsd)}`);
    if (item.lines?.length) {
      for (const line of item.lines) {
        const label = line.label ?? "—";
        lines.push(`  └ ${truncate(label, 100)} (${formatUsd(line.priceUsd)})`);
      }
    }
  }

  return truncate(lines.join("\n"), 1024);
}

function buildDiscordPayload(payload: DatabaseWebhookPayload): {
  embeds: Array<Record<string, unknown>>;
} {
  const record = payload.record;
  if (!record?.id) {
    throw new Error("Missing record");
  }

  const contact = `${truncate(String(record.social_network ?? "—"), 40)} · @${truncate(
    String(record.social_username ?? "—"),
    80,
  )}`;

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    {
      name: "Nombre",
      value: truncate(String(record.client_name?.trim() || "—"), 256),
      inline: true,
    },
    {
      name: "Contacto",
      value: contact,
      inline: true,
    },
    {
      name: "Pago",
      value: truncate(String(record.payment_method ?? "—"), 256),
      inline: true,
    },
    {
      name: "Total",
      value: formatUsd(record.total_usd),
      inline: true,
    },
    {
      name: "Ítems",
      value: formatItemsSummary(record.items),
      inline: false,
    },
    {
      name: "ID",
      value: truncate(record.id, 36),
      inline: false,
    },
  ];

  const notes = record.notes?.trim();
  if (notes) {
    fields.push({
      name: "Notas",
      value: truncate(notes, 1024),
      inline: false,
    });
  }

  return {
    embeds: [
      {
        title: "Nueva propuesta de carrito",
        color: 0x5865f2,
        fields,
        timestamp: new Date().toISOString(),
        footer: { text: `${SCHEMA_NAME}.${TABLE_NAME}` },
      },
    ],
  };
}

function unauthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function postToDiscord(webhookUrl: string, body: object): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("Discord webhook failed", response.status, detail);
    throw new Error(`Discord responded with ${response.status}`);
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("COMMISSIONS_NOTIFY_SECRET");
  if (expectedSecret) {
    const provided =
      request.headers.get("x-webhook-secret") ??
      request.headers.get("X-Webhook-Secret");
    if (provided !== expectedSecret) {
      return unauthorized();
    }
  }

  const discordWebhookUrl = Deno.env.get("DISCORD_WEBHOOK_URL");
  if (!discordWebhookUrl) {
    console.error("DISCORD_WEBHOOK_URL is not set");
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  let payload: DatabaseWebhookPayload;
  try {
    payload = (await request.json()) as DatabaseWebhookPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (payload.schema !== SCHEMA_NAME || payload.table !== TABLE_NAME) {
    return jsonResponse({ ok: true, skipped: "unexpected table" });
  }

  if (payload.type !== "INSERT") {
    return jsonResponse({ ok: true, skipped: "event type" });
  }

  try {
    const discordBody = buildDiscordPayload(payload);
    await postToDiscord(discordWebhookUrl, discordBody);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(message);
    return jsonResponse({ error: "Discord delivery failed" }, 502);
  }

  return jsonResponse({ ok: true });
});

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLE_NAME = "commissions_in_progress";
const SCHEMA_NAME = "public";

type CommissionRecord = {
  id: string;
  status_label?: string;
  service_title?: string;
  client_display?: string;
  started_on?: string;
  eta_on?: string;
};

type DatabaseWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: CommissionRecord | null;
  old_record: CommissionRecord | null;
};

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function fieldLabel(key: string): string {
  switch (key) {
    case "status_label":
      return "Estado";
    case "service_title":
      return "Obra";
    case "started_on":
      return "Inicio";
    case "eta_on":
      return "Entrega est.";
    default:
      return key;
  }
}

function buildChangeSummary(
  oldRecord: CommissionRecord,
  newRecord: CommissionRecord,
): string | null {
  const keys = ["status_label", "service_title", "started_on", "eta_on"] as const;
  const lines: string[] = [];

  for (const key of keys) {
    const before = String(oldRecord[key] ?? "");
    const after = String(newRecord[key] ?? "");
    if (before === after) continue;
    lines.push(
      `**${fieldLabel(key)}**: ${truncate(before, 120)} → ${truncate(after, 120)}`,
    );
  }

  if (lines.length === 0) return null;
  return truncate(lines.join("\n"), 1024);
}

function buildDiscordPayload(payload: DatabaseWebhookPayload): {
  embeds: Array<Record<string, unknown>>;
} {
  const record = payload.record;
  if (!record?.id) {
    throw new Error("Missing record");
  }

  const isInsert = payload.type === "INSERT";
  const title = isInsert ? "Nueva comisión en curso" : "Comisión actualizada";
  const color = isInsert ? 0x57f287 : 0xfee75c;

  const fields: Array<{ name: string; value: string; inline?: boolean }> = [
    {
      name: "Obra",
      value: truncate(String(record.service_title ?? "—"), 256),
      inline: false,
    },
    {
      name: "Estado",
      value: truncate(String(record.status_label ?? "—"), 256),
      inline: true,
    },
    {
      name: "Inicio",
      value: truncate(String(record.started_on ?? "—"), 256),
      inline: true,
    },
    {
      name: "Entrega est.",
      value: truncate(String(record.eta_on ?? "—"), 256),
      inline: true,
    },
    {
      name: "ID",
      value: truncate(record.id, 36),
      inline: false,
    },
  ];

  if (payload.type === "UPDATE" && payload.old_record) {
    const changes = buildChangeSummary(payload.old_record, record);
    if (changes) {
      fields.push({ name: "Cambios", value: changes, inline: false });
    }
  }

  return {
    embeds: [
      {
        title,
        color,
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

  if (payload.type !== "INSERT" && payload.type !== "UPDATE") {
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

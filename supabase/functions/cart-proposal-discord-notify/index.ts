import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLE_NAME = "cart_submissions";
const SCHEMA_NAME = "public";

type HomeCurrency = "usd" | "ars";

type CartLine = {
  label?: string;
  priceUsd?: number;
  priceArs?: number;
};

type CartItem = {
  serviceTitle?: string;
  totalUsd?: number;
  lines?: CartLine[];
};

type CartSubmissionItemsDocument = {
  displayCurrency?: string;
  items?: CartItem[];
};

type CartSubmissionRecord = {
  id: string;
  client_name?: string | null;
  social_network?: string;
  social_username?: string;
  payment_method?: string | null;
  notes?: string | null;
  items?: CartItem[] | CartSubmissionItemsDocument | null;
  total_usd?: number | string;
  display_currency?: string | null;
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

function parseSubmissionItems(raw: CartSubmissionRecord["items"]): {
  items: CartItem[];
  embeddedCurrency: HomeCurrency | null;
} {
  if (Array.isArray(raw)) {
    return { items: raw, embeddedCurrency: null };
  }
  if (raw && typeof raw === "object" && Array.isArray(raw.items)) {
    const embeddedCurrency =
      raw.displayCurrency === "ars"
        ? "ars"
        : raw.displayCurrency === "usd"
          ? "usd"
          : null;
    return { items: raw.items, embeddedCurrency };
  }
  return { items: [], embeddedCurrency: null };
}

function inferCurrencyFromLinePrices(items: CartItem[]): HomeCurrency | null {
  for (const item of items) {
    for (const line of item.lines ?? []) {
      const ars = line.priceArs;
      const usd = line.priceUsd;
      if (
        typeof ars === "number" &&
        Number.isFinite(ars) &&
        typeof usd === "number" &&
        Number.isFinite(usd) &&
        ars !== usd &&
        ars >= 1_000
      ) {
        return "ars";
      }
    }
  }
  return null;
}

function resolveDisplayCurrency(
  record: CartSubmissionRecord,
  embeddedCurrency: HomeCurrency | null,
  cartItems: CartItem[],
): HomeCurrency {
  if (record.display_currency === "ars") return "ars";
  if (embeddedCurrency === "ars") return "ars";
  return inferCurrencyFromLinePrices(cartItems) ?? "usd";
}

function formatMoney(amount: number, currency: HomeCurrency): string {
  if (!Number.isFinite(amount)) return "—";
  if (currency === "usd") return `${amount} USD`;
  return `${amount.toLocaleString("es-AR")} ARS`;
}

function parseTotalUsd(value: number | string | undefined): number {
  if (value === undefined || value === null || value === "") return 0;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function lineAmount(line: CartLine, currency: HomeCurrency): number {
  if (currency === "usd") {
    return typeof line.priceUsd === "number" && Number.isFinite(line.priceUsd) ? line.priceUsd : 0;
  }
  if (typeof line.priceArs === "number" && Number.isFinite(line.priceArs)) {
    return line.priceArs;
  }
  return typeof line.priceUsd === "number" && Number.isFinite(line.priceUsd) ? line.priceUsd : 0;
}

function itemDisplayTotal(item: CartItem, currency: HomeCurrency): number {
  if (currency === "usd") {
    return typeof item.totalUsd === "number" && Number.isFinite(item.totalUsd) ? item.totalUsd : 0;
  }
  return (item.lines ?? []).reduce((sum, line) => sum + lineAmount(line, currency), 0);
}

function cartDisplayGrandTotal(
  record: CartSubmissionRecord,
  currency: HomeCurrency,
  cartItems: CartItem[],
): number {
  if (currency === "usd") {
    return parseTotalUsd(record.total_usd);
  }
  return cartItems.reduce((sum, item) => sum + itemDisplayTotal(item, currency), 0);
}

function formatItemsSummary(items: CartItem[] | undefined, currency: HomeCurrency): string {
  if (!items?.length) return "—";

  const lines: string[] = [];
  for (const item of items) {
    const title = item.serviceTitle ?? "Servicio";
    lines.push(
      `• **${truncate(title, 80)}** — ${formatMoney(itemDisplayTotal(item, currency), currency)}`,
    );
    if (item.lines?.length) {
      for (const line of item.lines) {
        const label = line.label ?? "—";
        lines.push(
          `  └ ${truncate(label, 100)} (${formatMoney(lineAmount(line, currency), currency)})`,
        );
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

  const { items: cartItems, embeddedCurrency } = parseSubmissionItems(record.items);
  const currency = resolveDisplayCurrency(record, embeddedCurrency, cartItems);
  const grandTotal = cartDisplayGrandTotal(record, currency, cartItems);

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
      value: formatMoney(grandTotal, currency),
      inline: true,
    },
    {
      name: "Ítems",
      value: formatItemsSummary(cartItems, currency),
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

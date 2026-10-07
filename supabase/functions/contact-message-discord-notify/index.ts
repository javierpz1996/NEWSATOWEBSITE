import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const TABLE_NAME = "contact_messages";
const SCHEMA_NAME = "public";

type ContactMessageRecord = {
  id: string;
  title?: string;
  message?: string;
  created_at?: string;
};

type DatabaseWebhookPayload = {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: ContactMessageRecord | null;
  old_record: ContactMessageRecord | null;
};

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function buildDiscordPayload(payload: DatabaseWebhookPayload): {
  embeds: Array<Record<string, unknown>>;
} {
  const record = payload.record;
  if (!record?.id) {
    throw new Error("Missing record");
  }

  const title = truncate(String(record.title ?? "—").trim(), 256);
  const message = truncate(String(record.message ?? "—").trim(), 4000);

  return {
    embeds: [
      {
        title: "Nuevo mensaje de contacto",
        color: 0xeb459e,
        fields: [
          { name: "Título", value: title || "—", inline: false },
          { name: "Mensaje", value: message || "—", inline: false },
          { name: "ID", value: truncate(record.id, 36), inline: false },
        ],
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

import { parseCartSubmissionItems } from "@/lib/cart-submission-items";
import type { HomeCartItem } from "@/lib/home-cart";
import type { HomeCurrency } from "@/lib/home-currency";
import { createSupabaseAdminClient } from "@/lib/supabase/server-admin";

export type CartSubmissionRow = {
  id: string;
  created_at: string;
  client_name: string | null;
  social_network: string;
  social_username: string;
  payment_method: string | null;
  notes: string | null;
  items: HomeCartItem[];
  total_usd: number;
  display_currency: HomeCurrency;
};

export async function listCartSubmissions(): Promise<{
  rows: CartSubmissionRow[];
  error: string | null;
}> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return {
      rows: [],
      error:
        "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor. Agregala en .env.local (solo servidor, nunca NEXT_PUBLIC).",
    };
  }

  const { data, error } = await supabase
    .from("cart_submissions")
    .select(
      "id, created_at, client_name, social_network, social_username, payment_method, notes, items, total_usd, display_currency",
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { rows: [], error: error.message };
  }

  const rows: CartSubmissionRow[] = (data ?? []).map((row) => ({
    id: String(row.id),
    created_at: String(row.created_at),
    client_name: row.client_name ?? null,
    social_network: String(row.social_network),
    social_username: String(row.social_username),
    payment_method: row.payment_method != null ? String(row.payment_method) : null,
    notes: row.notes ?? null,
    ...(() => {
      const parsed = parseCartSubmissionItems(row.items);
      const columnCurrency =
        row.display_currency === "ars" || row.display_currency === "usd"
          ? row.display_currency
          : null;
      return {
        items: parsed.items,
        display_currency: columnCurrency ?? parsed.displayCurrency ?? "usd",
      };
    })(),
    total_usd: Number(row.total_usd),
  }));

  return { rows, error: null };
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isCartSubmissionId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function deleteCartSubmission(id: string): Promise<{ ok: boolean; error: string | null }> {
  if (!isCartSubmissionId(id)) {
    return { ok: false, error: "ID de pedido inválido." };
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    return { ok: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor." };
  }

  const { error, count } = await supabase
    .from("cart_submissions")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!count) {
    return { ok: false, error: "Pedido no encontrado." };
  }

  return { ok: true, error: null };
}

import { buildCartSubmissionItemsDocument } from "@/lib/cart-submission-items";
import type { HomeCartItem } from "@/lib/home-cart";
import type { HomeCurrency } from "@/lib/home-currency";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type SubmitCartProposalInput = {
  clientName: string;
  socialNetworkLabel: string;
  socialUsername: string;
  paymentMethodLabel: string;
  notes: string;
  items: HomeCartItem[];
  currency: HomeCurrency;
};

export class CartProposalSubmitError extends Error {
  override readonly name = "CartProposalSubmitError";

  constructor(
    message: string,
    readonly causeDetail?: string,
  ) {
    super(message);
  }
}

function sumCartTotalUsd(items: HomeCartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalUsd, 0);
}

export async function submitCartProposalToSupabase(input: SubmitCartProposalInput): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new CartProposalSubmitError(
      "El envío no está configurado todavía. Probá más tarde o escribime por redes.",
    );
  }

  const totalUsd = sumCartTotalUsd(input.items);
  const itemsDocument = buildCartSubmissionItemsDocument(input.currency, input.items);

  const { error } = await supabase.from("cart_submissions").insert({
    client_name: input.clientName.trim() || null,
    social_network: input.socialNetworkLabel,
    social_username: input.socialUsername.trim(),
    payment_method: input.paymentMethodLabel,
    notes: input.notes.trim() || null,
    items: itemsDocument,
    total_usd: totalUsd,
    display_currency: input.currency,
  });

  if (error) {
    throw new CartProposalSubmitError(
      "No se pudo enviar la propuesta. Revisá tu conexión e intentá de nuevo.",
      error.message,
    );
  }
}

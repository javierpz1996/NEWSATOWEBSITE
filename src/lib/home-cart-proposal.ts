import { CONTACT_EMAIL } from "@/lib/contact";
import { formatHomeCartUsd, type HomeCartItem } from "@/lib/home-cart";

export const CART_PROPOSAL_MAILTO_SUBJECT = "Propuesta de comisión";

export const CART_PROPOSAL_SOCIAL_OPTIONS = [
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "Twitter / X" },
  { id: "youtube", label: "YouTube" },
  { id: "deviantart", label: "DeviantArt" },
  { id: "threads", label: "Threads" },
] as const;

export type CartProposalSocialId = (typeof CART_PROPOSAL_SOCIAL_OPTIONS)[number]["id"];

export function getCartProposalSocialLabel(socialId: string): string | null {
  const match = CART_PROPOSAL_SOCIAL_OPTIONS.find((option) => option.id === socialId);
  return match?.label ?? null;
}

export function getCartProposalPaymentLabel(
  paymentId: string,
  options: ReadonlyArray<{ id: string; label: string }>,
): string | null {
  const match = options.find((option) => option.id === paymentId);
  return match?.label ?? null;
}

export type CartProposalMailtoPayload = {
  clientName: string;
  socialNetworkLabel: string;
  socialUsername: string;
  paymentMethodLabel: string;
  notes: string;
  items: HomeCartItem[];
};

function formatCartProposalBody(payload: CartProposalMailtoPayload): string {
  const lines: string[] = ["Propuesta desde el carrito del sitio", ""];

  const name = payload.clientName.trim();
  if (name) {
    lines.push(`Nombre: ${name}`);
  }
  lines.push(
    `Red social: ${payload.socialNetworkLabel}`,
    `Usuario: ${payload.socialUsername.trim()}`,
    `Método de pago: ${payload.paymentMethodLabel}`,
    "",
    "--- Pedido ---",
  );

  let grandTotal = 0;
  for (const item of payload.items) {
    lines.push(item.serviceTitle);
    for (const line of item.lines) {
      lines.push(`  · ${line.label}: ${formatHomeCartUsd(line.priceUsd)}`);
    }
    lines.push(`  Total ítem: ${formatHomeCartUsd(item.totalUsd)}`, "");
    grandTotal += item.totalUsd;
  }

  lines.push(`Total estimado: ${formatHomeCartUsd(grandTotal)}`);

  const notes = payload.notes.trim();
  if (notes) {
    lines.push("", "Notas:", notes);
  }

  return lines.join("\n");
}

export function buildCartProposalMailtoHref(payload: CartProposalMailtoPayload): string {
  const params = new URLSearchParams({
    subject: CART_PROPOSAL_MAILTO_SUBJECT,
    body: formatCartProposalBody(payload),
  });

  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

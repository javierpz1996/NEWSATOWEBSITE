export const CONTACT_EMAIL = "satotesteos@gmail.com";

export const CONTACT_MAILTO_SUBJECT = "Consulta sobre comision";

export type ContactMailtoPayload = {
  message: string;
};

export function buildContactMailtoHref({ message }: ContactMailtoPayload): string {
  const params = new URLSearchParams({
    subject: CONTACT_MAILTO_SUBJECT,
    body: message.trim(),
  });

  return `mailto:${CONTACT_EMAIL}?${params.toString()}`;
}

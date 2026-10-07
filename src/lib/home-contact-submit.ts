import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";

export type SubmitContactMessageInput = {
  title: string;
  message: string;
};

export class ContactMessageSubmitError extends Error {
  override readonly name = "ContactMessageSubmitError";

  constructor(
    message: string,
    readonly causeDetail?: string,
  ) {
    super(message);
  }
}

export async function submitContactMessageToSupabase(
  input: SubmitContactMessageInput,
): Promise<void> {
  const supabase = createSupabaseBrowserClient();
  if (!supabase) {
    throw new ContactMessageSubmitError(
      "El envío no está configurado todavía. Probá más tarde o escribime por redes.",
    );
  }

  const title = input.title.trim();
  const message = input.message.trim();
  if (!title) {
    throw new ContactMessageSubmitError("Completá el título antes de enviar.");
  }
  if (!message) {
    throw new ContactMessageSubmitError("Completá el mensaje antes de enviar.");
  }

  const { error } = await supabase.from("contact_messages").insert({
    title,
    message,
  });

  if (error) {
    throw new ContactMessageSubmitError(
      "No se pudo enviar el mensaje. Revisá tu conexión e intentá de nuevo.",
      error.message,
    );
  }
}

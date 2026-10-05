/** Placeholder commission rules copy (ES). Replace with definitive text before launch. */

import { CONTACT_EMAIL } from "@/lib/contact";

export const COMMISSION_RULES_HREF = "/reglas" as const;

export const COMMISSION_RULES_LAST_UPDATED = "4 de octubre de 2026";

export const COMMISSION_RULES_CONTACT_EMAIL = CONTACT_EMAIL;

export type CommissionRulesSection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export const COMMISSION_RULES_SECTIONS: CommissionRulesSection[] = [
  {
    id: "antes-de-pedir",
    title: "1. Antes de pedir una comisión",
    paragraphs: [
      "Leé estas reglas por completo antes de enviar una solicitud. Al pedir una comisión confirmás que las aceptás en su versión vigente en el Sitio.",
      "Las comisiones son por encargo digital: el alcance, el estilo y el precio se acuerdan por mensaje antes de comenzar el trabajo.",
    ],
  },
  {
    id: "solicitud",
    title: "2. Cómo solicitar",
    paragraphs: [
      "Escribime por los canales de contacto publicados en el Sitio con la siguiente información:",
    ],
    listItems: [
      "Tipo de comisión (servicio o categoría que te interese).",
      "Descripción clara de la idea, personajes y ambiente.",
      "Referencias visuales (imágenes, enlaces o archivos que puedas compartir).",
      "Indicación de contenido SFW o NSFW, si aplica.",
      "Uso previsto (personal, redes, comercial, etc.), para valorar permisos y alcance.",
    ],
  },
  {
    id: "pagos",
    title: "3. Pagos",
    paragraphs: [
      "El pago se acuerda caso por caso antes de iniciar. Salvo acuerdo distinto, suele requerirse un adelanto para reservar lugar en la lista y comenzar el boceto.",
      "Los métodos de pago aceptados y los montos se confirman por mensaje. No comienzo trabajo sin confirmación de pago según lo acordado.",
    ],
  },
  {
    id: "revisiones",
    title: "4. Bocetos, revisiones y cambios",
    paragraphs: [
      "El proceso incluye etapas de revisión acordadas al inicio. Las correcciones incluidas cubren ajustes razonables dentro del brief aprobado.",
      "Cambios mayores de concepto, personajes o composición después de aprobar una etapa pueden requerir tiempo o costo adicional.",
    ],
  },
  {
    id: "plazos",
    title: "5. Plazos y lista de espera",
    paragraphs: [
      "Los plazos estimados son orientativos y dependen de la complejidad, la cola de trabajos y tu velocidad de respuesta en las revisiones.",
      "Si surge un retraso relevante, te aviso por el mismo canal de contacto.",
    ],
  },
  {
    id: "uso",
    title: "6. Uso del arte y derechos",
    paragraphs: [
      "Salvo pacto escrito distinto, recibís el archivo para el uso personal acordado. La reventa del arte como producto propio, uso comercial no pactado o reclamar la autoría del estilo de la artista no está permitido.",
      "Puedo mostrar el trabajo terminado (o en proceso, si lo acordamos) en portfolio y redes, salvo que solicites confidencialidad por adelantado y lo aceptemos por escrito.",
    ],
  },
  {
    id: "contenido",
    title: "7. Contenido permitido",
    paragraphs: [
      "No acepto encargos que infrinjan leyes aplicables, promuevan odio o violencia real, o involucren menores en contextos sexuales o explotadores.",
      "El contenido NSFW, si está disponible, tiene reglas y límites adicionales que se confirman antes de aceptar el encargo.",
    ],
  },
  {
    id: "cancelaciones",
    title: "8. Cancelaciones y reembolsos",
    paragraphs: [
      "Si cancelás después de iniciado el trabajo, el adelanto cubre el tiempo ya dedicado y no es reembolsable en la parte correspondiente al avance realizado.",
      "Si yo no puedo completar el encargo, se acuerda devolución o entrega parcial según lo ya producido y lo pagado.",
    ],
  },
  {
    id: "contacto",
    title: "9. Consultas",
    paragraphs: [
      "Para dudas sobre estas reglas o el estado de un encargo, escribime por los canales de contacto del Sitio.",
    ],
  },
];

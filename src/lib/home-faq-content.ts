export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

/** Placeholder FAQ copy for the home maquette — replace with final ES/EN content. */
export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    id: "process",
    question: "¿Cómo funciona el proceso de una comisión?",
    answer:
      "Primero charlamos tu idea por redes o correo, definimos alcance y presupuesto. Luego sigo los pasos de boceto, revisión y entrega final que ves en la sección de comisiones.",
  },
  {
    id: "payment",
    question: "¿Cómo se manejan los pagos?",
    answer:
      "Los detalles de pago (anticipo, métodos disponibles y saldo final) se acuerdan en el mensaje inicial. Este texto es provisional hasta definir la política real.",
  },
  {
    id: "revisions",
    question: "¿Puedo pedir cambios en el boceto?",
    answer:
      "Sí, en la etapa de boceto podés pedir ajustes dentro del alcance acordado. Cambios mayores pueden requerir un adicional o más tiempo.",
  },
  {
    id: "refunds",
    question: "¿Qué pasa con cancelaciones o reembolsos?",
    answer:
      "Las condiciones dependen de en qué etapa esté el trabajo. Aquí irá la política oficial cuando esté lista; por ahora es solo texto de maqueta.",
  },
  {
    id: "files",
    question: "¿En qué formato recibo los archivos?",
    answer:
      "Normalmente archivos listos para web o impresión según el tipo de pieza. El formato exacto se confirma al cerrar la comisión.",
  },
];

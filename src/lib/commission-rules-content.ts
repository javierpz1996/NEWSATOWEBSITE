import { CONTACT_EMAIL } from "@/lib/contact";

export const COMMISSION_RULES_HREF = "/rules" as const;

/** Insert in drawing list copy; renders as a line break on narrow viewports only. */
export const COMMISSION_RULES_MOBILE_LINE_BREAK = "{{mobile-br}}";

export const COMMISSION_RULES_LAST_UPDATED = "5 de octubre de 2026";

export const COMMISSION_RULES_CONTACT_EMAIL = CONTACT_EMAIL;

export type CommissionRulesSubsection = {
  title: string;
  paragraphs?: string[];
  listItems?: string[];
};

export type CommissionRulesSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  listItems?: string[];
  subsections?: CommissionRulesSubsection[];
};

export type CommissionRulesDrawingTone = "green" | "orange" | "pink";

export type CommissionRulesDrawingBlock = {
  id: string;
  tone: CommissionRulesDrawingTone;
  title: string;
  listItems: string[];
};

export type CommissionRulesDictionaryEntry = {
  term: string;
  definition: string;
};

export type CommissionRulesDictionaryExampleImage = {
  src: `/works/placeholder/${string}.png`;
  alt: string;
  width: number;
  height: number;
};

export type CommissionRulesDictionary = {
  title: string;
  beforeExample: CommissionRulesDictionaryEntry[];
  exampleLabel: string;
  exampleImages: CommissionRulesDictionaryExampleImage[];
  afterExample: CommissionRulesDictionaryEntry[];
};

export const COMMISSION_RULES_DICTIONARY: CommissionRulesDictionary = {
  title: "Diccionario",
  beforeExample: [
    {
      term: "fondo plano",
      definition:
        "color simple a elección, se aceptan detalles decorativos (ej: estrellitas/corazones, efectos, burbujas de texto). **Incluído gratuitamente.**",
    },
    {
      term: "fondo simple",
      definition:
        "objetos o detalles decorativos, sin mucho trabajo de composición. Tiene **cargos extra** dependiendo el **tipo de comisión**.",
    },
  ],
  exampleLabel: "Ejemplo:",
  exampleImages: [
    {
      src: "/works/placeholder/fondo1.png",
      alt: "Ejemplo de fondo simple: rincón con escritorio, silla y estantería.",
      width: 1230,
      height: 1280,
    },
    {
      src: "/works/placeholder/fondo2.png",
      alt: "Ejemplo de fondo simple: habitación con cama, estantería y elementos decorativos.",
      width: 1230,
      height: 1280,
    },
  ],
  afterExample: [
    {
      term: "fondo detallado",
      definition:
        "objetos, perspectiva, decoraciones y composición bien cuidados, incluye **colores, sombreado, iluminación y buen renderizado**. Tiene **cargos extra** dependiendo el **tipo de comisión**.",
    },
    {
      term: "Hoja de poses de 1 personaje",
      definition:
        "incluye poses, expresiones, ropa, detalles del diseño, vistas **frontal/lateral/trasera**. sirve para representar mejor su personalidad y características. **Incluye:** **1 cuerpo completo** + **2 busto hacia arriba** + **chibi o cabeza o accesorios**. **extras:** estrellitas/corazones, efectos, burbujas de texto.",
    },
  ],
};

export const COMMISSION_RULES_DRAWING_BLOCKS: CommissionRulesDrawingBlock[] = [
  {
    id: "dibujo",
    tone: "green",
    title: "Dibujo",
    listItems: [
      "- **SFW**",
      `- **NSFW** (desnudos, sangre, ${COMMISSION_RULES_MOBILE_LINE_BREAK}gore, escenas sexuales explícitas)`,
      "- **Nekomimi**",
      "- **OCs** / personajes originales",
      "- **Fanarts**",
      "- **Personas reales**",
      "- **Mascotas**",
      "- **Fondos complejos**",
    ],
  },
  {
    id: "dibujo-limitado",
    tone: "orange",
    title: "No es mi fuerte pero podría intentar:",
    listItems: [
      "- **Furry** (no es mi fuerte)",
      "- **Perspectivas complejas** (todavía estoy aprendiendo)",
    ],
  },
  {
    id: "dibujo-no",
    tone: "pink",
    title: "No dibujo:",
    listItems: [
      "- **Mechas y robots** (no es mi fuerte)",
      "- Contenido que promueva el **odio**, la **discriminación**, el **racismo** o la **propaganda política**",
      "- Contenido que involucre a **menores en situaciones inapropiadas**",
      "- Cualquier contenido que considere **moralmente incorrecto o perjudicial**",
    ],
  },
];

export const COMMISSION_RULES_SECTIONS: CommissionRulesSection[] = [
  {
    id: "terminos-de-servicio",
    title: "Términos de servicio",
    paragraphs: [
      "Al encargarme una comisión, aceptás que has **leído y aceptado** todos los términos descritos aquí.",
      "Al realizar una comisión, acepta que la obra será utilizada **únicamente con fines personales**, a menos que se adquieran los **derechos de uso comercial** (se aplican tarifas adicionales dependiendo del servicio), y que **todos los créditos** de la imagen serán otorgados a mí.",
      "No participaré ni permitiré el uso de mi arte en proyectos que involucren el uso de **inteligencia artificial generativa de imágenes**.",
      "Las personas que incumplan estos términos serán añadidas a una **lista negra** de manera **indefinida**.",
    ],
  },
  {
    id: "como-trabajo",
    title: "Cómo trabajo",
    paragraphs: [
      "Desde ésta página el cliente enviará una **solicitud** para realizar su comisión, el artista podrá decidir si **aceptarla** (o **cancelarla** si no cumple con los términos de servicio)",
      "Si la solicitud es aceptada el artista se pondrá en contacto con el cliente y se le enviará los datos necesarios para realizar el **pago inicial** a través del método de pago seleccionado en el formulario de solicitud.",
      "Luego de abonar el **monto inicial** acordado, el cliente deberá proporcionar una **descripción escrita** e **imágenes** de lo que desea para la comisión, manteniendo siempre una comunicación **respetuosa y laboral**.",
      "En caso de solicitar una comisión basada en **personas reales**, el cliente es responsable de asegurarse de contar con el **consentimiento y/o autorización** necesarios de las personas representadas. No me hago responsable por la falta de consentimiento, autorización o cualquier conflicto derivado del uso de la imagen de una persona sin su permiso.",
      "Al finalizar el trabajo y abonar el **monto restante** acordado, la comisión **sin firma ni marca de agua** es entregada a través de una **carpeta en drive**.",
      "Incluirá: Dibujo **con fondo** (dependiendo la comisión), **sin fondo** (fondo blanco) y el **PNG** (fondo transparente).",
      "Pasados unos meses, esa carpeta y sus archivos **serán eliminados**.",
      "Me gusta mantener **comunicación constante** con el cliente al momento de trabajar en su pedido para asegurarse que está de acuerdo con los **avances del dibujo**.",
    ],
  },
  {
    id: "tiempo-de-entrega",
    title: "Tiempo de entrega",
    paragraphs: [
      "El tiempo de entrega dependerá del **tipo de comisión**, su **complejidad** y mi **carga de trabajo**. Los clientes pueden chequear la **línea de espera** de comisiones en ésta misma página.",
      "El proceso de realización suele tomar **aproximadamente 2 semanas** y puede extenderse hasta **1-2 meses**, dependiendo de cada proyecto. En caso de que surja algún retraso o sea necesario modificar el plazo de entrega, se **informará al cliente con anticipación**.",
      "Quiero que sepan que actualmente tengo un **trabajo fuera de las comisiones**, trabajo por la mañana y tarde, es un trabajo que requiere **esfuerzo físico** por lo es probable que llegue **cansada** algunos días.",
    ],
  },
  {
    id: "correcciones",
    title: "Correcciones",
    paragraphs: [
      "No se realizarán más de **2 o 3 reinicios completos** del boceto en caso de que sea necesario descartarlo y comenzar de nuevo.",
      "**BOCETO:** Se aceptan **todas las correcciones** que el cliente considere necesarias.",
      "**LINEART:** **No** se aceptarán modificaciones **importantes** en el dibujo o la **pose**.",
      "**COLOREADO:** El cliente recibirá una versión con los **colores base** de la ilustración para comprobar que sean correctos. Podrá solicitar **cambios en los colores** si lo considera necesario.",
      "**RENDERIZADO:** Solo **correcciones menores** y dentro de las posibilidades del artista.",
      "Todas las correcciones, cambios y revisiones solicitadas durante el proceso pueden **extender el tiempo estimado de entrega** de la comisión.",
    ],
  },
  {
    id: "forma-de-pago",
    title: "Forma de pago",
    paragraphs: [
      "El cliente deberá abonar el **50%** del valor total de la comisión para que pueda comenzar el proceso de trabajo. Durante este proceso, se le proporcionarán **avances del boceto** para que pueda solicitar las correcciones necesarias.",
      "No se proporcionará ningún archivo en **alta resolución** ni ninguna versión **sin firma o marca de agua** hasta que el cliente haya completado el **pago restante**.",
      "De esta manera, el cliente puede asegurarse de que recibirá su comisión **sin tener que abonar el importe total por adelantado**.",
      "Si el cliente quedó especialmente satisfecho con mi trabajo y atención, las **propinas** son bienvenidas y muy apreciadas.",
    ],
    subsections: [
      {
        title: "Uso — comisión personal",
        listItems: [
          "- El cliente podrá utilizar la obra **únicamente para uso personal**.",
          "- El cliente tiene derecho a **imprimir o realizar reproducciones físicas** de la obra, siempre que sean exclusivamente para su **uso personal** (que no sean destinadas a la venta).",
          "- El cliente podrá utilizar la obra para **fines personales**, incluyendo, entre otros: **avatares**, **fondos de pantalla** para teléfonos o computadoras y **páginas web o perfiles personales**.",
        ],
      },
      {
        title: "Acuerdo de uso comercial",
        paragraphs: [
          "Si el cliente desea solicitar una comisión para **uso comercial**, el **precio total** de la comisión, así como cualquier **regalía adicional** que corresponda, el cliente deberá seleccionar correctamente el **tipo de uso** en el formulario.",
        ],
      },
      {
        title: "Derechos de propiedad intelectual",
        paragraphs: [
          "Yo, como artista, conservo **todos los derechos** sobre las obras realizadas. El cliente está adquiriendo **derechos de uso**, no la **propiedad** de la obra.",
          "No permito que mis obras sean utilizadas para fines relacionados con **inteligencia artificial** ni tecnologías similares. No está permitido subir mis obras a sitios o **plataformas de IA**.",
          "El uso de mis obras para **IA** está **estrictamente prohibido**. El uso de mis obras para **NFT** también está **estrictamente prohibido**.",
          "El cliente no podrá **atribuirse la autoría** de mi trabajo ni presentarlo como propio.",
        ],
      },
      {
        title: "Reembolsos",
        paragraphs: [
          "El artista realizará un reembolso del **pago inicial** únicamente si la etapa de **boceto aún no ha comenzado**.",
          "Una vez comenzada la etapa de **boceto**, **no se realizarán reembolsos**.",
          "Si el artista cancela la comisión, se realizará un reembolso del **100%** del pago. El artista se reserva el derecho de cancelar una comisión y realizar el reembolso correspondiente en cualquier momento.",
        ],
      },
      {
        title: "Comunicación",
        paragraphs: [
          "El tiempo de respuesta del artista puede variar y ser de **hasta una semana**.",
          "También es responsabilidad del cliente mantener una **comunicación adecuada** y responder de manera oportuna. El artista no se responsabiliza por retrasos ocasionados por una **falta de respuesta o comunicación** por parte del cliente.",
          "No se tolerará ningún tipo de **acoso o presión** hacia el artista respecto al ritmo de trabajo, independientemente del tiempo que haya transcurrido.",
          "El cliente tiene derecho a ser **informado** sobre cualquier retraso que pueda afectar el plazo de entrega.",
        ],
      },
      {
        title: "Acuerdo final",
        paragraphs: [
          "Al realizar una comisión conmigo, el cliente reconoce que ha **leído, comprendido y aceptado** todos los términos y condiciones anteriormente descritos.",
        ],
      },
    ],
  },
];

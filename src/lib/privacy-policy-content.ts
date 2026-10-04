/** Placeholder legal copy (ES). Replace with definitive text before launch. */

import { CONTACT_EMAIL } from "@/lib/contact";

export const PRIVACY_POLICY_LAST_UPDATED = "4 de octubre de 2026";

export const PRIVACY_POLICY_CONTACT_EMAIL = CONTACT_EMAIL;

export type PrivacyPolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
};

export const PRIVACY_POLICY_SECTIONS: PrivacyPolicySection[] = [
  {
    id: "introduccion",
    title: "1. Introducción",
    paragraphs: [
      "Esta política de privacidad describe cómo se trata la información cuando visitás este sitio web de portfolio (el «Sitio»). El Sitio es de acceso público, no requiere cuenta y no incluye un panel de usuario.",
      "El texto es provisional: se actualizará cuando se publiquen los datos definitivos de la titular y las herramientas finales de medición o contacto.",
    ],
  },
  {
    id: "responsable",
    title: "2. Responsable del tratamiento",
    paragraphs: [
      "La persona titular del Sitio es responsable del tratamiento de los datos personales que se recaben a través de los medios indicados en esta política.",
      "Para ejercer tus derechos o hacer consultas sobre privacidad, podés escribir a la dirección de contacto indicada al final de este documento.",
    ],
  },
  {
    id: "datos",
    title: "3. Qué datos pueden tratarse",
    paragraphs: [
      "Según cómo uses el Sitio, pueden tratarse los siguientes tipos de información:",
    ],
    listItems: [
      "Preferencias guardadas en tu dispositivo (por ejemplo, consentimiento de cookies o tema visual), mediante almacenamiento local del navegador.",
      "Datos técnicos habituales de navegación (dirección IP, tipo de navegador, idioma, páginas visitadas) si en el futuro se incorporan herramientas de analítica o registros del proveedor de hosting.",
      "Datos que incluyas voluntariamente si nos escribís por correo electrónico o redes sociales enlazadas desde el Sitio (contenido del mensaje, dirección de email, nombre si lo indicás).",
    ],
  },
  {
    id: "finalidad",
    title: "4. Finalidad y base legal",
    paragraphs: [
      "Usamos la información para recordar tus preferencias en el Sitio, mantener el funcionamiento técnico, responder consultas que nos envíes por los canales de contacto y, cuando corresponda y lo aceptes, medir el uso del Sitio de forma agregada para mejorarlo.",
      "La base legal dependerá de cada tratamiento: tu consentimiento (cookies no esenciales), la ejecución de medidas precontractuales o tu solicitud de contacto, y el interés legítimo en la seguridad y el mantenimiento del Sitio, siempre dentro de lo permitido por la normativa aplicable.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies y almacenamiento local",
    paragraphs: [
      "El Sitio puede usar almacenamiento local (por ejemplo localStorage) para recordar si aceptaste o rechazaste el aviso de cookies y otras preferencias de interfaz.",
      "Las cookies o tecnologías similares estrictamente necesarias para el funcionamiento del Sitio no requieren consentimiento. Las cookies o scripts de analítica o marketing, si se incorporan más adelante, solo se activarán cuando los aceptes desde el aviso correspondiente.",
      "Podés borrar o bloquear cookies y datos locales desde la configuración de tu navegador; algunas funciones del Sitio podrían dejar de recordar tus preferencias.",
    ],
  },
  {
    id: "terceros",
    title: "6. Destinatarios y transferencias",
    paragraphs: [
      "El Sitio se aloja en infraestructura de terceros (proveedor de hosting). Esos proveedores pueden procesar datos técnicos necesarios para servir las páginas.",
      "Si enlazamos a redes sociales u otros sitios externos, sus políticas de privacidad aplican una vez que salís del Sitio. No vendemos datos personales.",
    ],
  },
  {
    id: "conservacion",
    title: "7. Plazo de conservación",
    paragraphs: [
      "Las preferencias guardadas en tu dispositivo permanecen hasta que las borres o hasta que caduquen según la configuración del Sitio.",
      "Los mensajes de contacto se conservarán el tiempo necesario para atender tu consulta y cumplir obligaciones legales, y después se eliminarán o anonimizarán cuando ya no sean necesarios.",
    ],
  },
  {
    id: "derechos",
    title: "8. Tus derechos",
    paragraphs: [
      "Según la legislación que te corresponda, podés solicitar acceso, rectificación, supresión, oposición, limitación del tratamiento o portabilidad de tus datos, así como retirar el consentimiento cuando el tratamiento se base en él.",
      "También podés presentar una reclamación ante la autoridad de protección de datos de tu jurisdicción si considerás que no hemos atendido correctamente tu solicitud.",
    ],
  },
  {
    id: "cambios",
    title: "9. Cambios en esta política",
    paragraphs: [
      "Podemos actualizar esta política para reflejar cambios en el Sitio o en la normativa. Publicaremos la versión vigente en esta página e indicaremos la fecha de última actualización.",
    ],
  },
  {
    id: "contacto",
    title: "10. Contacto",
    paragraphs: [],
  },
];

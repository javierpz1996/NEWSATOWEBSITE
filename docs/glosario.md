# Glosario

Términos usados en los ADRs y en el proyecto, en orden alfabético.
Las definiciones son operativas: qué significa **acá**.

---

**ADR (Architecture Decision Record)**
Documento breve que registra una decisión técnica importante: contexto,
qué se decidió, consecuencias y alternativas. Vive en `docs/adr/`.

**App Router**
Sistema de rutas de Next.js basado en archivos, dentro de `src/app/`.
Cada `page.tsx` es una ruta, cada `layout.tsx` un contenedor compartido.
Es el que usamos (no el Pages Router).

**Alternate links (`hreflang`)**
Etiquetas en el `<head>` que le dicen al buscador qué URL corresponde a cada
idioma (`/es/works` ↔ `/en/works`). Las genera next-intl.

**Build estático (SSG)**
Página compilada a HTML en el momento del deploy, no renderizada por request.
Todo el sitio de este proyecto es SSG.

**Cache Components**
Modelo opcional de Next 16 (antes PPR + `dynamicIO`) para cachear piezas de una
página. **No lo usamos**: el sitio es estático puro.

**Client Component**
Componente React que corre en el navegador, marcado con `'use client'`.
Se usa para interactividad (modal, toggle de tema, menú).

**`components.json`**
Archivo de configuración del CLI de shadcn/ui: estilo, colores base, aliases.
Solo hace falta si usás el CLI.

**Core Web Vitals**
Métricas de rendimiento percibido (LCP, CLS, INP). Importan para SEO.

**Design System (DS)**
Conjunto de reglas visuales: paleta, tipografías, espaciados, componentes.
El de este proyecto se diseña **después** de la base (ADR-0004).

**`generateStaticParams`**
Función que le dice a Next qué valores toma un segmento dinámico (`[locale]`)
para generar las páginas en build.

**i18n (internacionalización)**
Preparar el sitio para varios idiomas/regiones. Acá: español e inglés.

**`locale`**
Código de idioma que viaja en la ruta: `es`, `en`.

**Locale detection**
Negociación automática del idioma: prefijo en la URL → cookie guardada →
header `accept-language` → idioma por defecto (`es`).

**MDX**
Markdown con JSX: permite escribir texto con componentes embebidos.
Lo usamos para los textos largos de las páginas (`src/content/<locale>/`).

**Middleware → Proxy**
Antes `middleware.ts`, ahora `proxy.ts` en Next 16: código que corre antes de
que la petición llegue a la página. next-intl lo usa para redirigir `/` → `/es`.
Corre en runtime `nodejs` (no edge).

**Motion**
Movimiento en la interfaz (revelados, transiciones, hovers). En este proyecto
es "expresivo" y siempre respeta `prefers-reduced-motion`.

**next-intl**
Librería de i18n para App Router: routing, mensajes, formato de fechas/números.

**next-themes**
Librería que aplica el modo oscuro (`class="dark"` en `<html>`) sin flash al
cargar.

**OG image**
Imagen que aparece cuando compartís un link en redes o chats
(`opengraph-image.tsx`). Generada por Next con la metadata de cada página.

**`PageProps<'/ruta'>`**
Tipo global de Next 16 que da `params` y `searchParams` ya tipados y
prometidos (hay que `await`earlos).

**RSC (React Server Component)**
Componente que corre solo en el servidor: no viaja al navegador y puede leer
archivos o base de datos. Por defecto, todos los componentes de App Router.

**`shadcn/ui`**
No es una librería de npm: es código que se copia a tu proyecto
(`src/components/ui/`) y podés modificar libremente.

**Serie**
Agrupación de obras por carpeta en `public/works/<serie>/`.

**Turbopack**
Bundler que Next 16 usa por defecto en `dev` y `build`. No requiere flags.

**Tokens semánticos**
Variables CSS con nombre de significado (`--background`, `--primary`) en vez de
color crudo. Permiten cambiar la identidad sin tocar componentes: es lo que
deja preparada la base para el DS.

**`useTranslations`**
Hook de next-intl para leer strings de `messages/<locale>.json`.

**View Transitions**
API de React 19.2 / Next 16 para animar el cambio entre páginas al navegar.

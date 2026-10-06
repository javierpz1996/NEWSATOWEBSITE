# AGENTS.md — NewSatoWeb

Portfolio personal de una artista/dibujante. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · ES/EN · 100% estático · deploy en Vercel.

> **Qué versus por qué**: este archivo tiene reglas (qué hacer). El porqué vive en
> [`docs/adr/`](docs/adr/). No se duplica información: si una regla choca con un ADR, se discute el ADR.

## Cómo usar este archivo

1. Las reglas de **Reglas permanentes** son inviolables.
2. Antes de escribir código de Next.js, leé las **docs versionadas** al final de este archivo (las de tu memoria de entrenamiento pueden estar desactualizadas).
3. Dudas de plan/estado → [`PLAN.md`](PLAN.md). Duda de un término → [`docs/glosario.md`](docs/glosario.md).

---

## Reglas permanentes

### 1. Verificación — nada queda "terminado" sin esto

```bash
pnpm build && pnpm lint && pnpm typecheck
```

Los tres en verde. No hay CI ni tests: esta verificación **es** la puerta. Si hay UI nueva,
además recorrerla en el navegador.

### 2. Next.js

- **No editar** el bloque `<!-- NEXT-AGENTS-MD-START … END -->` (lo genera `next dev` y el
  codemod `agents-md`; si lo tocás se regenera igual). Todo lo propio va **fuera** del bloque.
- **`src/proxy.ts`**, con `export function proxy()`. `middleware.ts` está deprecado en Next 16.
- `params` y `searchParams` siempre se `await`an. Tipos: `PageProps<'/ruta'>`, `LayoutProps`.
- **No habilitar** `cacheComponents`, PPR ni `reactCompiler` sin un ADR nuevo que lo justifique.
- Toda imagen pasa por `next/image`. Nunca `<img>`.
- No `output: 'export'`, no `next/legacy/image`, no Pages Router.

### 3. Idiomas y rutas (next-intl)

- Rutas **en inglés** bajo `[locale]`: `/[locale]/works` · `/about` · `/commissions` · `/contact`.
  Locales: `es` (default) y `en`.
- **Ningún texto visible hardcodeado en componentes**: todo sale de
  `messages/es.json` y `messages/en.json`.
- Navegación **solo** con los wrappers de [`src/i18n/navigation.ts`](src/i18n/navigation.ts)
  (`Link`, `useRouter`, `usePathname`, `redirect`). Nunca `next/link` ni `next/navigation`
  directamente dentro de `[locale]`.
- Toda página/layout nuevo agrega `generateStaticParams` para `routing.locales` y valida el
  locale con `hasLocale(routing.locales, locale)` → `notFound()` si no corresponde.
- **Idioma del código**: inglés (identificadores, comentarios, nombres de archivo, rutas).
  **Idioma de `docs/`**: español.

### 4. UI, accesibilidad y motion

- Solo **tokens semánticos**: `bg-background`, `text-foreground`, `border-border`, `ring-ring`,
  `text-muted-foreground`. Nada de `text-black`, `bg-zinc-50` ni hex sueltos en componentes.
- El design system **aún no existe**: no inventar estética nueva ni agregar paletas paralelas.
  El checklist de lo que falta está en [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md).
- Accesibilidad no negociable: **foco visible** en todo lo interactivo · modal con **Esc**,
  foco atrapado y `aria-label` · **alt descriptivo** en cada obra · **contraste AA** en los dos
  temas · **mobile-first** (1 columna en móvil) · navegación completa por **teclado**.
- Toda animación respeta **`prefers-reduced-motion`**.

### 5. Componentes, estado y datos

- `src/components/ui/*` es código **editable** (open code de shadcn): se ajusta directo para
  acercarlo al DS. Componentes compartidos → `src/components/{layout,gallery}/`. Lógica de una
  sola página → junto a esa página.
- `'use client'` **solo** cuando hay interactividad real. Por defecto: Server Component.
- **Sin librería de estado global**: Server Components + `useState`/`useRef` locales.
- Sin API routes ni auth de visitantes; el sitio sigue siendo estático en build salvo el
  envío del carrito a Supabase ([ADR-0006](docs/adr/0006-supabase-carrito-propuestas.md)).
  Contacto general: `mailto:` + redes ([ADR-0005](docs/adr/0005-sin-backend-contacto-y-deploy.md)).
- Variables de entorno: solo las `NEXT_PUBLIC_SUPABASE_*` del ADR-0006 (plantilla
  `.env.example`); nunca commitear `.env.local`.
- **Dependencias**: justificar la nueva y anotarla en el ADR correspondiente **antes** de
  instalarla.

### 6. Contenido

- Las obras son **archivos de imagen en `public/works/<series>/`**. Nada de obras en otra
  carpeta, ni assets grandes fuera de ahí, ni URLs remotas sin configurar `remotePatterns`.
- Todo el contenido actual es **placeholder**: **nunca inventar datos reales de la artista**
  (nombre, biografía, redes, precios, obra real).
- Textos largos de página: MDX en `src/content/<locale>/`. Strings de UI: `messages/`.

### 7. Repo

- **Sin secrets**: `.env*` está ignorado y no se commitea. Hoy el proyecto no tiene variables
  de entorno.
- Rama `main` directa, commits chicos y siempre con la verificación en verde.
- Fuera del repo: `.agents/`, `._*` (resource forks de macOS), `.DS_Store`, `node_modules/`,
  `.next/`, `*.tsbuildinfo`.

---

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Dev server con Turbopack (si el 3000 está ocupado arranca en 3001) |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint (flat config) |
| `pnpm typecheck` | `tsc --noEmit` |

`pnpm` está en `~/.local/bin`. Si no lo encontrás:
`export PATH="$HOME/.local/bin:$PATH"`

## Dónde vive qué

| Necesito… | Archivo |
|---|---|
| El plan, las fases y su estado | [`PLAN.md`](PLAN.md) |
| Por qué se decidió algo | [`docs/adr/NNNN-*.md`](docs/adr/) |
| Qué significa un término | [`docs/glosario.md`](docs/glosario.md) |
| Reglas visuales / checklist del DS | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) |
| Cómo arrancar el proyecto y su entorno | [`PLAN.md`](PLAN.md) → *Notas del entorno* |
| Docs oficiales de Next 16.3 | Bloque al final de este archivo (versionadas en `node_modules/next/dist/docs/`) |

---

## Docs de Next.js 16.3 — índice generado, no editar

El contenido que sigue lo genera y reescribe Next. Si lo modificás, se restaura en el próximo
`next dev`. Consultá los archivos en `node_modules/next/dist/docs/` antes de codear Next.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

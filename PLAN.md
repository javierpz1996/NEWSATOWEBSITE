# PLAN — NewSatoWeb

> **Base del proyecto**: portfolio personal de una artista/dibujante.
> Documento vivo: se actualiza al cierre de cada fase.

## Perfil

| | |
|---|---|
| **Qué es** | Portfolio personal de artista/dibujante |
| **Objetivos** | Mostrar ilustraciones y trabajos, tipos de commissions, estilo, info de la artista, trabajos anteriores, formulario de contacto/commissions y redes sociales |
| **Idiomas** | Español + Inglés (prefijo `/es` · `/en`, default `es`) |
| **Contenido** | Estático: MDX local para textos + archivos de imagen para obras |
| **Público** | 100% público, sin auth ni áreas privadas |
| **Deploy** | Vercel |
| **Identidad** | Artística y personal, **no** corporativa. Motion expresivo. El design system propio se aplica después de esta base |

## Decisiones del grill (resumen)

1. Prefijo de rutas `/es` · `/en` con `defaultLocale: 'es'` — ADR-0002
2. Imágenes de las obras en local (`public/works/`) — ADR-0003
3. Galería = grid + **modal con zoom** (sin página por obra) — ADR-0003
4. Base con **tokens neutros + checklist** para el design system futuro — ADR-0004
5. Motion expresivo (reveal, hover, transiciones de página) — ADR-0004
6. Contacto = email directo + redes (sin backend) — ADR-0005
7. Modo oscuro con toggle — ADR-0004
8. SEO completa (OG, sitemap, robots) — ADR-0005
9. Contenido placeholder en ambos idiomas — ADR-0003
10. Tooling: pnpm, `src/`, ESLint flat, TS estricto, React Compiler y Cache Components **apagados** — ADR-0001

## Fases

| # | Fase | Estado | Entregable |
|---|---|---|---|
| 0 | Docs de decisión | ✅ | `PLAN.md`, `docs/adr/0001…0005`, `docs/glosario.md` |
| 1 | Scaffold | ✅ | Next 16.3.8 + TS + Tailwind v4 + ESLint + `src/` + pnpm |
| 2 | shadcn/ui | ⏳ | `shadcn init` + componentes base + `next-themes` |
| 3 | i18n (next-intl) | ⏳ | `[locale]`, `proxy.ts`, dictionaries, redirect `/` → `/es` |
| 4 | Layout y rutas | ⏳ | Header/nav + footer con redes + locale switcher + theme toggle + 5 páginas placeholder |
| 5 | Galería | ⏳ | Escaneo de `public/works/**`, grid responsive, `Dialog` con zoom |
| 6 | SEO | ⏳ | `generateMetadata` por locale, OG images, `sitemap.ts`, `robots.ts` |
| 7 | Verificación y DS | ⏳ | `build` + `lint` + `typecheck` + recorrido en navegador + `docs/DESIGN-SYSTEM.md` |

## Estructura objetivo

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx            # header, footer, providers
│   │   ├── page.tsx              # home
│   │   ├── galeria/page.tsx      # grid + modal zoom
│   │   ├── commissions/page.tsx
│   │   ├── sobre-mi/page.tsx
│   │   └── contacto/page.tsx
│   ├── layout.tsx                # root layout
│   ├── sitemap.ts  robots.ts  opengraph-image.tsx  icon.tsx
│   └── not-found.tsx / error.tsx / loading.tsx
├── components/
│   ├── ui/                       # shadcn (código tuyo, editable)
│   ├── layout/                   # header, footer, nav, locale-switcher, theme-toggle
│   └── gallery/                  # gallery-grid, work-modal
├── content/<locale>/             # MDX: home, commissions, sobre-mi, contacto
├── i18n/                         # routing.ts, request.ts, navigation.ts
├── dictionaries/ → messages/     # es.json, en.json (next-intl)
├── lib/  hooks/  styles/
└── proxy.ts                      # antes middleware.ts (Next 16)
messages/                         # es.json · en.json
docs/adr/  docs/glosario.md  docs/DESIGN-SYSTEM.md
```

## Comandos

```bash
export PATH="$HOME/.local/bin:$PATH"   # ver "Notas del entorno"
pnpm dev        # next dev (Turbopack)
pnpm build      # next build
pnpm lint       # eslint
pnpm typecheck  # tsc --noEmit
```

## Notas del entorno

- **pnpm** no estaba instalado. Se instaló con
  `npm install -g --prefix "$HOME/.local" pnpm` (sin sudo, vive en `~/.local/bin`).
  Habilitarlo en cada terminal: `export PATH="$HOME/.local/bin:$PATH"`.
  Alternativa permanente: `corepack enable pnpm` (requiere sudo) o agregar
  `~/.local/bin` al `PATH` en `~/.zshrc`.
- `create-next-app` rechaza nombres con mayúsculas: el paquete se llama
  **`new-sato-web`** (el folder `NewSatoWeb` no puede ser el nombre npm).
- El scaffold se generó en un subdirectorio temporal y se movió a la raíz,
  porque la carpeta ya contenía `.agents/` y `skills-lock.json`.
- **`AGENTS.md`** se generó con `npx @next/codemod@canary agents-md 16.3.8`
  y apunta a las docs versionadas de Next 16.3.8 en
  `node_modules/next/dist/docs/`. Si desaparece, regenerarlo con ese comando.
- **`._*`** (resource forks de macOS, propios de este volumen) se limpian con
  `find . -name '._*' -not -path './node_modules/*' -not -path './.next/*' -delete`
  y ya están excluidos de git y de ESLint.
- `pnpm dev` ocupó el puerto **3001** porque el **3000 estaba tomado** por el
  dev server de otro proyecto (`mi-trabajo`). Si 3001 no es el esperado, revisar
  qué más está corriendo.
- **Git**: repo inicializado y con el contenido **staged, sin commit** (no hay
  `git config user.name/email`). Antes de commitear: `git config user.name "…"`
  y `git config user.email "…"`. `.agents/` queda **fuera** del repo
  (`.gitignore`), junto con `._*` y `.DS_Store`.

## Referencias (doc oficial consultada)

- Next.js 16.3 — https://nextjs.org/docs (App Router) · upgrade v16 · `create-next-app`
- shadcn/ui — https://ui.shadcn.com/docs · `/docs/components-json`
- next-intl — https://next-intl.dev/docs/routing/setup · `/docs/routing/middleware`

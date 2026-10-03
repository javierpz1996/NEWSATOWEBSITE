# ADR-0001 · Stack de tecnología

- **Estado**: Aceptado
- **Fecha**: 2026-10-01
- **Contexto**: arranque de la base de NewSatoWeb, un sitio público sin backend.

## Contexto

El sitio es el portfolio de una artista: páginas de contenido, una galería de
ilustraciones con modal de zoom, contacto por email y redes. No hay usuarios,
ni datos privados, ni escritura desde la interfaz. Se necesita identidad
artística con movimiento, dos idiomas y deploy en Vercel. El design system
visual lo va a definir la artista después de esta base, así que el stack debe
dejar los tocs preparados sin imponer una estética.

## Decisión

| Capa | Elección | Versión instalada |
|---|---|---|
| Framework | Next.js **App Router** | 16.3.8 |
| Lenguaje | TypeScript (estricto) | 5.9.3 |
| UI | React Server Components | 19.2.8 |
| Estilos | Tailwind CSS v4 (configuración por CSS, `@theme`) | 4.3.3 |
| Componentes | **shadcn/ui**, estilo `new-york`, `baseColor: neutral`, `cssVariables: true` | CLI `shadcn@latest` |
| i18n | **next-intl** | última estable |
| Tema | **next-themes** (estrategia `class`) | última |
| Linter | **ESLint 9** flat config (`eslint.config.mjs`) | 9.x |
| Bundler | **Turbopack** (default de Next 16, sin flags) | — |
| Paquetes | **pnpm** 12 | 12.8.1 |
| Estructura | código en `src/`, alias `@/*` | — |

Creación del scaffold:

```bash
pnpm create next-app@latest <dir> \
  --typescript --eslint --tailwind --app --src-dir \
  --import-alias "@/*" --use-pnpm --yes
```

### Opt-outs deliberados

- **React Compiler** apagado (`reactCompiler: true` no se usa): aumenta tiempos
  de build y todavía no aporta a un sitio con poco estado de cliente.
- **Cache Components / PPR** apagado (`cacheComponents: true`): todo el sitio es
  estático, no aporta y obliga a envolver datos en `<Suspense>`.
- **Biome** descartado: se mantiene el ESLint con `eslint-config-next`.

## Consecuencias

- **Turbopack por defecto**: `next dev` y `next build` lo usan. Si algún plugin
  inyecta config `webpack`, el build falla a propósito (hay flags `--webpack`
  como escape).
- **`next lint` ya no existe**: el linting corre por script (`pnpm lint` →
  `eslint`). `next build` **no** lintea.
- **Async Request APIs obligatorias**: `params`, `searchParams`, `cookies()`,
  `headers()` siempre se `await`an. Se usan los tipos globales
  `PageProps<'/ruta'>`, `LayoutProps`, `RouteContext` (generados con
  `next typegen`).
- **`middleware.ts` → `proxy.ts`**: Next 16 renombró la convención y corre en
  runtime `nodejs` (no edge). Ver ADR-0002.
- **shadcn/ui es código copiado, no una librería**: los componentes viven en
  `src/components/ui/` y se modifican directamente.
- **Tres opciones de shadcn son inmutables** después del init (`style`,
  `baseColor`, `cssVariables`): se eligen una sola vez, antes de instalar
  componentes.

## Alternativas consideradas

- **Pages Router**: descartado, sin Server Components ni las APIs nuevas.
- **Vite + React**: descartado, pierde SSG/metadata/imagen optimizada de fábrica.
- **Librería de componentes (MUI, Chakra)**: descartada — choca con la
  personalización visual profunda que pide la identidad artística.
- **Biome / npm / yarn**: alternativas válidas; se eligió el stack por defecto
  recomendado para reducir superficie de decisión.

## Referencias

- https://nextjs.org/docs/app/getting-started/installation
- https://nextjs.org/docs/app/guides/upgrading/version-16
- https://nextjs.org/docs/app/api-reference/cli/create-next-app
- https://ui.shadcn.com/docs/components-json

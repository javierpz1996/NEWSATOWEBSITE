# ADR-0005 · Sin backend, contacto y deploy

- **Estado**: Aceptado
- **Fecha**: 2026-10-01
- **Relacionado**: ADR-0001 (stack), ADR-0003 (contenido)

## Contexto

El sitio es público y no tiene escritura: no hay login, ni panel, ni datos de
usuarios. Las solicitudes de commissions llegan por email o redes. Se necesita
definir el alcance de backend, la estrategia de contacto y dónde se deploya.

## Decisión

### 1. Alcance: sitio 100% estático

- **Sin** autenticación, **sin** áreas privadas.
- **Sin** Server Actions, **sin** route handlers dinámicos.
- **Sin** `cacheComponents` / PPR: no hay datos que cachear por request.
- Todo se genera en build (SSG vía `generateStaticParams`) → máximo rendimiento
  y costo cero de compute en Vercel.

### 2. Contacto: email + redes directos

- Botón `mailto:` con asunto precargado (`[Commission] …`) en `/[locale]/contacto`.
- Links a las redes de la artista en el footer y en la página de contacto.
- **Sin formulario con backend** en esta base. Si más adelante se necesita, el
  camino previsto es un Route Handler + Resend (queda como ADR futuro).

### 3. Deploy: Vercel

- Plataforma de referencia de Next.js: sin config extra, previews por PR.
- Imágenes locales optimizadas por `next/image` (no hay `remotePatterns` por
  ahora; ver ADR-0003 para la posible migración a CDN).
- Variables de entorno: ninguna necesaria en esta base.

### 4. SEO completo (fase 6)

| Archivo | Qué hace |
|---|---|
| `generateMetadata` por página | title/description por locale |
| `opengraph-image.tsx` | OG image generada (importante: el portfolio se comparte por link) |
| `sitemap.ts` | Todas las URLs de ambos idiomas |
| `robots.ts` | Permite todo, apunta al sitemap |
| `icon.tsx` / `favicon.ico` | Placeholder hasta que exista la identidad |

Incluye **alternate links por idioma** (`hreflang`) que next-intl ya expone.

### 5. Scripts y calidad

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit"
}
```

- `pnpm build` **no** lintea (Next 16 lo sacó): lint y typecheck son pasos
  separados y forman parte de la verificación de la fase 7.
- Git: `git init` + `.gitignore` (lo trae el scaffold).

## Consecuencias

- Agregar un formulario real, CMS o auth implica **otro ADR**: cambia el modelo
  de rendering de estático a dinámico en esas rutas.
- Todo el site es cacheable en CDN: cualquier cambio requiere redeploy.
- Sin variables de entorno, el proyecto corre igual en local y en producción.

## Alternativas consideradas

- **Formulario + route handler (Resend)**: descartado para la base — requiere
  cuenta, API key y manejo de spam. Camino previsto si se necesita.
- **Formspree u otro tercero**: dependencia externa con límites gratuitos.
- **Docker / self-hosted**: descartado — fuera del alcance y sin beneficio para
  un sitio estático.
- **Static export (`output: 'export'`)**: descartado — rompe `proxy.ts` de
  next-intl (no corre en export) y la lectura de archivos en build.

## Referencias

- https://nextjs.org/docs/app/getting-started/deploying
- https://nextjs.org/docs/app/guides/proxy
- https://nextjs.org/docs/app/api-reference/file-conventions/sitemap

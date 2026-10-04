# ADR-0002 · Idiomas y rutas (i18n)

- **Estado**: Aceptado
- **Fecha**: 2026-10-01
- **Relacionado**: ADR-0001 (stack), ADR-0003 (contenido)

## Contexto

El sitio tiene dos idiomas: español e inglés. Las URLs deben ser indexables y
compartibles (`/es/works`, `/en/works`) y el visitante sin prefijo debe
caer en un idioma razonable.

## Decisión

**Routing por prefijo con `next-intl`**, usando el segmento dinámico `[locale]`:

| Aspecto | Valor |
|---|---|
| Locales | `['es', 'en']` |
| `defaultLocale` | `'es'` |
| `localePrefix` | `'always'` (default) |
| `localeDetection` | activada: prefijo → cookie → `accept-language` → default |
| Archivos de mensajes | `messages/es.json`, `messages/en.json` |

### Archivos que arma la integración

```
src/i18n/
├── routing.ts       # defineRouting({locales, defaultLocale})
├── request.ts       # getRequestConfig + next/root-params + hasLocale + notFound()
└── navigation.ts    # createNavigation(routing) → Link, useRouter, usePathname…

src/proxy.ts         # createMiddleware(routing) + matcher
```

```ts
// src/proxy.ts — la convención de Next 16 (antes middleware.ts)
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
```

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

### Renderizado estático

Como `[locale]` es dinámico, se necesita `generateStaticParams` y
`next/root-params` (disponible **por defecto en Next 16.3+**) para que las
páginas se generen en build en vez de renderizarse en cada request:

```ts
// src/app/[locale]/layout.tsx
import * as rootParams from 'next/root-params';   // vía i18n/request.ts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
```

El layout valida el locale con `hasLocale(routing.locales, locale)` y llama a
`notFound()` si no corresponde. `setRequestLocale` **no** se usa: está marcado
como legacy en favor de `next/root-params`.

### Metadata

`generateMetadata` recibe el `locale` y usa
`getTranslations({locale, namespace: 'Metadata'})` para que los titles también
sean estáticos y estén en el idioma correcto.

## Consecuencias

- `/` redirige al idioma negociado (cookie/`accept-language`), por defecto `/es`.
- Todas las páginas viven bajo `src/app/[locale]/`; no hay páginas sueltas
  fuera de ese segmento (salvo `layout.tsx` raíz y los archivos de metadata).
- Agregar un idioma = 1 línea en `routing.locales` + 1 archivo `messages/<lc>.json`.
- Los textos de UI salen de los JSON de mensajes; los textos narrativos largos
  del MDX van por carpeta por locale (ver ADR-0003).
- `proxy.ts` corre en runtime `nodejs`: no sirve para lógica edge.

## Alternativas consideradas

- **i18n manual (dictionaries + `[locale]`)**: cero dependencias, pero había que
  reinventar detección, redirects, cookies y alternate links.
- **Sin prefijo (idioma por cookie)**: URLs compartidas no determinísticas y peor
  SEO.
- **Routing por dominio (`en.ejemplo.com`)**: requiere subdominios y DNS; no aplica
  a un portfolio.

## Referencias

- https://next-intl.dev/docs/routing/setup
- https://next-intl.dev/docs/routing/middleware
- https://next-intl.dev/docs/getting-started/app-router
- https://nextjs.org/docs/app/guides/upgrading/version-16 (middleware → proxy)

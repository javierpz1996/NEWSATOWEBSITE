# ADR-0003 · Modelo de contenido

- **Estado**: Aceptado
- **Fecha**: 2026-10-01
- **Relacionado**: ADR-0002 (i18n), ADR-0004 (identidad)

## Contexto

Hay tres tipos de contenido y cada uno tiene un origen distinto:

1. **Obras / ilustraciones** — imágenes que crecen con el tiempo.
2. **Textos narrativos** — home, commissions, sobre-mi, contacto, en dos idiomas.
3. **Strings de UI** — botones, labels, metaetiquetas, también en dos idiomas.

## Decisión

### 1. Obras: solo archivos de imagen

```
public/works/
├── <serie-1>/01.jpg
├── <serie-1>/02.jpg
└── <serie-2>/…
```

- La galería **escanea el directorio en build** con `fs.readdirSync` desde un
  Server Component. No hay base de datos ni CMS.
- El slug de la obra deriva del nombre de archivo. La serie, de la carpeta.
- **La galería no tiene página por obra**: el detalle es un modal con zoom
  (ver ADR-0004 / fase 5).

**Extensión prevista (no implementada)**: si hacen falta títulos, años o pies
de foto, se agrega un `public/works/<serie>/meta.json` opcional que la galería
lee si existe. El nombre de archivo sigue siendo el identificador, así que no
hay que migrar nada para adoptarlo.

### 2. Textos de páginas: MDX local

```
src/content/<locale>/<pagina>.mdx     # es/ y en/
```

- Colecciones por carpeta de locale (paralelo a `messages/`, para que la
  estructura sea predecible).
- Frontmatter cuando aporta (título, descripción para SEO).
- Render con `next-mdx-remote` o el loader que corresponda en la fase 3.

### 3. Strings de UI: mensajes de next-intl

```
messages/es.json
messages/en.json
```

- Nombrespaces por página (`HomePage`, `Nav`, `GalleryPage`, `Metadata`…).
- Incluye también los **títulos y descriptions de SEO** por locale.

### 4. Contenido inicial: placeholder en ambos idiomas

- Obras de ejemplo: imágenes locales generadas/marcadores de posición en
  `public/works/`, en ambas carpetas de serie.
- Textos de ejemplo reales en español y su traducción en inglés, para que la
  base se vea completa y navegable.
- Todo el contenido placeholder está marcado para ser reemplazado.

## Consecuencias

- **Repo que crece**: las imágenes se versionan. Si el volumen pesa más de
  ~1 GB, evaluar Git LFS o mover `public/works/` a un CDN (quedaría documentado
  como cambio de ADR).
- Sin `meta.json`, el texto visible de una obra es su nombre de archivo: mientras
  haya placeholder no importa, pero **antes del contenido real conviene agregar
  el `meta.json`** por serie.
- Todo se genera en build: agregar una obra = subir el archivo y redeployar.
- La galería depende de `fs` en el servidor → no sirve para static export
  (`output: 'export'`), lo cual está bien porque deployamos en Vercel (ADR-0005).

## Alternativas consideradas

- **Obras como colección MDX con frontmatter**: da metadatos y traducción por
  obra, pero obliga a mantener un archivo por imagen. Se descartó por simplicidad.
- **Dataset en TypeScript**: más control que MDX, misma fricción de mantenimiento.
- **CMS headless**: requiere cuenta, editor y red; fuera del alcance de la base.

## Referencias

- https://nextjs.org/docs/app/getting-started/fetching-data
- https://nextjs.org/docs/app/api-reference/file-conventions/public-folder

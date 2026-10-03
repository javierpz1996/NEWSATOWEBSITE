# ADR-0004 · Identidad visual, tokens y motion

- **Estado**: Aceptado (la identidad final se define después; este ADR deja la base preparada)
- **Fecha**: 2026-10-01
- **Relacionado**: ADR-0001 (stack), ADR-0005 (alcance)

## Contexto

La identidad artística de la artista **todavía no existe**: se va a diseñar
después de esta base. Riesgo central: que la base imponga una estética y que
aplicar el design system después obligue a rehacer componentes.

Por otro lado, el sitio debe sentirse artístico y personal, con movimiento
expresivo, no un portfolio corporativo genérico (referencias de inspiración:
`yoshidaseiji.jp`, `suzukispace.com`, `lookback-anime.com` — se usan como
referencia de sensibilidad, **no** se copia ningún diseño).

## Decisión

### 1. Base neutra + checklist

- **Variables semánticas de shadcn** en `src/app/globals.css` con valores
  neutros funcionales (`--background`, `--foreground`, `--primary`,
  `--muted`, `--border`, `--ring`, `--radius`, etc.), en `:root` y `.dark`.
- **Tipografía interina**: la que traiga el scaffold, marcada explícitamente
  como placeholder. Las fuentes reales se cargan con `next/font` cuando el DS
  las defina.
- **`docs/DESIGN-SYSTEM.md`** (fase 7): checklist con qué tocar para aplicar el
  DS — paleta, tipografías (`next/font`), radio, espaciado, componentes shadcn
  a ajustar, estados hover/focus.

> Regla: aplicar el DS no debe tocar la estructura de componentes ni el
> enrutamiento; solo tokens, `globals.css` y ajustes puntuales en `components/ui/`.

### 2. shadcn/ui — opciones de init (inmutables después)

```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "src/app/globals.css", "baseColor": "neutral", "cssVariables": true }
}
```

`style`, `baseColor` y `cssVariables` **no se pueden cambiar** después de
inicializar: se fijan en la fase 2, antes de cualquier `shadcn add`.

### 3. Modo oscuro con toggle

- **`next-themes`** con estrategia `class` (`<html class="dark">`).
- `ThemeToggle` server-safe (evita flash de hidratación).
- Ambos temas viven en los tokens de `globals.css`; el DS define las dos
  paletas en un solo lugar.

### 4. Motion expresivo

| Dónde | Qué |
|---|---|
| Navegación | View Transitions de React 19.2 / Next 16 |
| Scroll | Reveal on scroll con `IntersectionObserver` |
| Galería | Hover con zoom suave de la miniatura + `Dialog` de shadcn para el zoom |
| Páginas | Fade/slide cortos al montar secciones |

- Todo el motion respeta **`prefers-reduced-motion`**: si el usuario pide
  menos movimiento, se desactivan las animaciones.
- Transiciones en `transition-*` de Tailwind + CSS variables para duraciones;
  sin librerías pesadas salvo que se justifique.

### 5. Galería: grid + modal con zoom

- `GalleryGrid`: columnas responsive (2 en móvil, 3–4 en desktop), objeto
  `cover` para la miniatura.
- `WorkModal`: `Dialog` de shadcn. Click/Enter abre, `Esc` cierra, foco
  atrapado (lo resuelve Radix). Zoom con clic o rueda dentro del modal,
  `next/image` con `fill` y `sizes` correctos.
- **Sin página por obra**: no hay URL por imagen (implicancia SEO aceptada y
  anotada en ADR-0003).

## Consecuencias

- La base se ve "neutra" a propósito: no es el look final.
- El checklist `docs/DESIGN-SYSTEM.md` es contrato de trabajo para aplicar el DS.
- `prefers-reduced-motion` es requisito de accesibilidad, no opcional.
- Elegir `baseColor: neutral` y `cssVariables: true` ahora es irreversible sin
  reinstalar componentes.

## Alternativas consideradas

- **Tema artístico provisorio diseñado por el agente**: se descartó — se
  rehace dos veces y ensucia la base.
- **Defaults de shadcn sin tocar**: se descartó — dejan deudas de tokens y el
  checklist queda incompleto.
- **Solo modo claro / solo oscuro**: se descartó — el toggle es barato con
  `next-themes` y el DS va a definir ambas paletas igual.

## Referencias

- https://ui.shadcn.com/docs/theming
- https://ui.shadcn.com/docs/dark-mode
- https://nextjs.org/docs/app/getting-started/fonts
- https://react.dev/reference/react/ViewTransition

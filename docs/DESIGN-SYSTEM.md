# Design System — primera dirección visual

> **Estado:** propuesta inicial para conversar. La ruta `/desing-system` funciona como guía viva de tokens y componentes. La identidad final se afina con la artista antes de aplicarla al portfolio completo.

## Dirección

Un portfolio editorial donde la obra lleva la voz principal. La composición combina la claridad de una página de artista, un sistema de navegación directo y el carácter de una publicación impresa. Fondos cálidos y espacios generosos ayudan a presentar imágenes; líneas finas, etiquetas técnicas y algún gesto gráfico construyen identidad sin competir con ellas.

Las referencias compartidas sugieren estas pautas:

- **Galería primero:** imágenes grandes, encuadres deliberados y metadatos discretos.
- **Navegación evidente:** pocas opciones y controles con nombres claros.
- **Tono editorial:** combinación de sans serif funcional y serif expresiva en títulos o piezas de texto seleccionadas.
- **Carácter gráfico:** contraste entre composiciones limpias, bloques de color y detalles tipográficos.
- **Contenido auténtico:** no usar obras, biografía, nombre, redes ni servicios inventados como si fueran reales. La portada actual es una maqueta abstracta; debe reemplazarse por obra aprobada.

## Tokens iniciales

Definidos en `src/app/globals.css`. Los valores son una primera propuesta extraída de la sensibilidad de las referencias, no colores definitivos de marca.

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| `background` | `#faf9f6` | `#1d1920` | Papel de página |
| `foreground` | `#201b24` | `#f5f2ed` | Texto principal |
| `card` | `#ffffff` | `#28232b` | Superficie elevada |
| `muted` | `#efede8` | `#342f37` | Superficie secundaria |
| `muted-foreground` | `#716d73` | `#b5afb8` | Texto secundario |
| `primary` | `#382641` | `#d9d0df` | Estructura y acciones |
| `accent` | `#a5b73d` | `#bacb55` | Acento vegetal, uso puntual |
| `border` | `#dedbd5` | `#48414b` | Separadores y contornos |
| `ring` | `#8d9e31` | `#bacb55` | Foco visible |
| `pastel-rose` | `#f3d9dc` | `#60464a` | Etiquetas y detalles suaves |
| `pastel-lilac` | `#e4def2` | `#4d465c` | Fondos de apoyo y foco en muestras |
| `pastel-blue` | `#d9e8f3` | `#405462` | Fondos de apoyo |
| `pastel-mint` | `#dcebe2` | `#40554a` | Estados sutiles |
| `pastel-butter` | `#f2ebc9` | `#5a5439` | Acento cálido de apoyo |

## Sombra y profundidad

La guía `/desing-system` muestra tres niveles de sombra para tarjetas y superficies: suave (`0 2px 8px`), media (`0 8px 24px`) y flotante (`0 18px 48px`). Se mantienen discretas y acompañan al borde. El índice de la guía también expone por separado bordes/radios, layout/retícula, componentes y movimiento.

## Tipografía de código

JetBrains Mono se carga mediante `next/font/google`, queda disponible como `--font-jetbrains-mono` y el alias `--font-code`. Se reserva para snippets, escala/valores de tokens y etiquetas técnicas; Geist Mono continúa como mono auxiliar durante la migración.

Los componentes usan clases semánticas (`bg-background`, `text-foreground`, `border-border`, etc.). No agregar hex sueltos a componentes. Los tonos pastel se limitan a superficies suaves, etiquetas o detalles; el texto sobre ellos usa tinta oscura. Antes de cerrar estos valores, revisar contraste AA y lectura de texto pequeño en claro y oscuro.

## Tipografía

- **Sans serif:** Geist Sans, provisional y funcional para navegación, interfaz, párrafos y pies.
- **Serif editorial:** Georgia como muestra de dirección; aún no se carga una familia serif de marca.
- **Mono:** Geist Mono para etiquetas, numeración y metadatos breves.
- **Escala de muestra:** título fluido grande; título de sección 38–60 px; cuerpo 14–17 px; etiquetas 8–10 px. Recalibrar con contenido real y traducciones ES/EN.

La página usa muestras CSS locales para explorar la combinación. El layout conserva Geist del scaffold para su integración posterior.

Clases reutilizables de escala tipográfica disponibles en `src/app/globals.css`: `.type-display`, `.type-h1`, `.type-h2`, `.type-h3`, `.type-body-lg`, `.type-body`, `.type-body-sm`, `.type-label`, `.type-caption`, `.type-code`, `.type-brand`, `.type-kanji` y `.type-role`. Los tamaños viven en variables `--type-*` para ajustar la escala desde un solo lugar.

## Forma, espacio y elevación

- Radio base: `0.35rem`; geometría mayormente recta, con esquinas suavizadas en controles.
- Líneas de 1 px para separar navegación, metadatos y fichas.
- Espaciado amplio en secciones editoriales y compacto en datos de interfaz.
- Elevación reservada para tarjetas de obra y elementos que deban distinguirse del papel.
- Evitar que marcos, sombras o fondos decorativos dominen sobre la ilustración.

## Motion e interacción

- Duración rápida: `180ms`; duración base: `280ms`.
- Hover sutil en enlaces, acciones y tarjetas; sin movimiento que distraiga de la obra.
- Foco visible con `ring`; controles con estados hover, active y disabled por completar al construir componentes reales.
- Toda animación respeta `prefers-reduced-motion`.
- Navegación completa por teclado. Diálogos futuros: Escape, foco atrapado y etiqueta accesible.

## Componentes demostrados

La ruta `/desing-system` organiza el glosario a la izquierda y las muestras a la derecha en seis capítulos: colores, tipografía, espaciado, superficies, componentes, y movimiento/foco. En móvil, el índice se convierte en una tira horizontal desplazable.

Al implementar shadcn/ui, traducir estas decisiones a componentes editables en `src/components/ui/*`, usando tokens semánticos y manteniendo el foco accesible.

## Pendiente de validar con la artista

- [ ] Confirmar si la paleta papel/tinta/ciruela/acento vegetal representa su obra.
- [ ] Elegir tipografías definitivas y verificar acentos, ñ y caracteres extendidos.
- [ ] Revisar composición y escala de títulos en español e inglés.
- [ ] Incorporar obras reales aprobadas y decidir el tratamiento individual de cada serie.
- [ ] Completar contraste AA de todos los estados y componentes.
- [ ] Diseñar estados active, pressed, disabled y error de los controles reales.
- [ ] Definir iconografía, tema oscuro y motion al integrar el layout.
- [ ] Recorrer en viewport móvil, teclado y lector de pantalla.
- [ ] Actualizar la identidad en este documento y marcar fase 7 en `PLAN.md` al cerrar la validación.

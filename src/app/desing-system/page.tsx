const entries = [
  { id: "colores", number: "01", title: "Colores", terms: "Paleta · Tokens · Contraste" },
  { id: "tipografia", number: "02", title: "Tipografía", terms: "Familias · Escala · Jerarquía" },
  { id: "espaciado", number: "03", title: "Espaciado", terms: "Spacing · Ritmo · Contenedor" },
  { id: "bordes", number: "04", title: "Bordes y radios", terms: "Contornos · Esquinas · Separadores" },
  { id: "sombras", number: "05", title: "Sombras", terms: "Elevación · Capas · Profundidad" },
  { id: "componentes", number: "06", title: "Componentes", terms: "Botones · Campos · Tarjetas" },
  { id: "layout", number: "07", title: "Layout", terms: "Contenedor · Grid · Breakpoints" },
  { id: "movimiento", number: "08", title: "Movimiento", terms: "Duración · Foco · Accesibilidad" },
];

const colors = [
  { name: "Papel", token: "background", value: "#faf9f6", className: "paper" },
  { name: "Tinta", token: "foreground", value: "#201b24", className: "ink" },
  { name: "Ciruela", token: "primary", value: "#382641", className: "plum" },
  { name: "Musgo", token: "accent", value: "#a5b73d", className: "moss" },
  { name: "Superficie", token: "card", value: "#ffffff", className: "surface" },
  { name: "Borde", token: "border", value: "#dedbd5", className: "outline" },
];

const pastels = [
  { name: "Rosa empolvado", token: "pastel-rose", value: "#f3d9dc", className: "rose" },
  { name: "Lila niebla", token: "pastel-lilac", value: "#e4def2", className: "lilac" },
  { name: "Azul cielo", token: "pastel-blue", value: "#d9e8f3", className: "blue" },
  { name: "Menta", token: "pastel-mint", value: "#dcebe2", className: "mint" },
  { name: "Manteca", token: "pastel-butter", value: "#f2ebc9", className: "butter" },
];

const spacing = [4, 8, 12, 16, 24, 32, 48, 64];

export default function DesignSystemPage() {
  return (
    <main className="ds-page">
      <aside className="ds-sidebar">
        <Link className="ds-brand" href="/" aria-label="New Sato Web, inicio"><span className="ds-brand-mark">N<span>✳</span></span><span>NEW SATO<br />VISUAL SYSTEM</span></Link>
        <div className="ds-sidebar-label">GLOSARIO / ÍNDICE</div>
        <nav className="ds-index" aria-label="Glosario del sistema visual">
          {entries.map((entry) => <a href={`#${entry.id}`} key={entry.id}><span className="ds-index-number">{entry.number}</span><span><strong>{entry.title}</strong><small>{entry.terms}</small></span><span className="ds-index-arrow">↗</span></a>)}
        </nav>
        <div className="ds-sidebar-bottom"><span className="ds-status-dot" /> SISTEMA EN CONSTRUCCIÓN <span>V. 01 / 2026</span></div>
      </aside>

      <div className="ds-content">
        <header className="ds-topbar"><span>DOCUMENTACIÓN <b>/</b> IDENTIDAD VISUAL</span><Link href="/">← Volver al inicio</Link></header>
        <section className="ds-intro">
          <p className="ds-kicker">DESIGN SYSTEM · BORRADOR 01</p>
          <h1>Las reglas detrás<br />de <em>cada detalle.</em></h1>
          <p>Una guía práctica para construir un portfolio editorial, cálido y centrado en la obra. Cada muestra de esta página expone los tokens y decisiones visuales que podremos ajustar juntos.</p>
          <div className="ds-meta"><span><b>08</b> CAPÍTULOS</span><span><b>ES</b> IDIOMA</span><span><b>ABIERTO</b> ESTADO</span></div>
        </section>

        <section id="colores" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">01 / FUNDAMENTOS</p><h2>Paleta de color</h2></div><p>Una base de papel y tinta. Ciruela para anclar la interfaz y musgo como acento puntual.</p></div>
          <div className="ds-color-grid">{colors.map((color) => <article className="ds-color-card" key={color.token}><div className={`ds-color-swatch ${color.className}`}><span>{color.value}</span></div><div className="ds-color-meta"><strong>{color.name}</strong><code>--{color.token}</code></div></article>)}</div>
          <div className="ds-pastel-heading"><div><span>PALETA DE APOYO</span><p>Tonos suaves para fondos de serie, etiquetas y pequeños acentos.</p></div><small>USAR CON TEXTO OSCURO</small></div>
          <div className="ds-pastel-grid">{pastels.map((color) => <article className={`ds-pastel-card ${color.className}`} key={color.token}><span>{color.value}</span><div><strong>{color.name}</strong><code>--{color.token}</code></div></article>)}</div>
          <div className="ds-theme-note"><span>◐</span><p><strong>Modo oscuro</strong><br />La misma jerarquía con superficies profundas y texto cálido. Los colores de marca conservan su función.</p><div className="ds-dark-chips"><i /><i /><i /><i /></div><small>OSCURO · PREVIA</small></div>
        </section>

        <section id="tipografia" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">02 / VOZ Y JERARQUÍA</p><h2>Tipografía</h2></div><p>Sans para leer y navegar, serif para dar un acento editorial, mono para datos breves.</p></div>
          <div className="ds-type-board"><div className="ds-type-line ds-display"><span className="ds-type-label">DISPLAY / SERIF</span><div className="type-display">La obra<br /><em>primero.</em></div><code>Georgia · 64 / 0.98</code></div><div className="ds-type-line ds-heading"><span className="ds-type-label">TÍTULO / SANS</span><div className="type-heading">Un espacio para mirar</div><code>Geist Sans · 32 / 1.1</code></div><div className="ds-type-line ds-body"><span className="ds-type-label">CUERPO / SANS</span><div className="type-body">Una estructura clara permite que cada ilustración respire. Los textos acompañan, orientan y dan contexto sin interrumpir la mirada.</div><code>Geist Sans · 16 / 1.65</code></div><div className="ds-type-line ds-caption"><span className="ds-type-label">ETIQUETA / CÓDIGO</span><div className="type-code">const artwork = &quot;portfolio&quot;;</div><code>JetBrains Mono · 10 / 1.4</code></div></div>
          <p className="ds-footnote">Las familias reales son provisionales: Geist viene del scaffold y Georgia representa la dirección serif. Elegir fuentes definitivas antes del lanzamiento.</p>
        </section>

        <section id="espaciado" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">03 / RITMO</p><h2>Espaciado</h2></div><p>Escala basada en múltiplos de 4 px. Mucho aire en composición; pasos compactos en controles.</p></div>
          <div className="ds-spacing-board">{spacing.map((value) => <div className="ds-space-row" key={value}><code>{String(value).padStart(2, "0")}</code><div className="ds-space-track"><i style={{ width: `${value * 2}px` }} /></div><span>{value}px</span><small>{value / 4}× base</small></div>)}</div>
        </section>

        <section id="bordes" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">04 / CONTORNOS</p><h2>Bordes y radios</h2></div><p>Contornos delicados ordenan las superficies. Esquinas casi rectas mantienen un tono editorial.</p></div>
        </section>

        <section id="sombras" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">05 / PROFUNDIDAD</p><h2>Sombras</h2></div><p>Tres niveles de elevación para separar controles, tarjetas y elementos flotantes del papel.</p></div>
          <div className="ds-elevation-board"><article><div className="ds-elevation-card elevation-low" /><strong>Suave</strong><code>0 2px 8px / 8%</code></article><article><div className="ds-elevation-card elevation-mid" /><strong>Media</strong><code>0 8px 24px / 10%</code></article><article><div className="ds-elevation-card elevation-high" /><strong>Flotante</strong><code>0 18px 48px / 14%</code></article><p>La sombra acompaña el borde; no reemplaza el contraste del contorno.</p></div>
        </section>

        <section id="componentes" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">06 / ELEMENTOS DE INTERFAZ</p><h2>Componentes</h2></div><p>Controles claros y tranquilos. El acento aparece en hover y foco, no como decoración constante.</p></div>
          <div className="ds-components-board"><div className="ds-component-group"><span className="ds-component-label">ACCIONES</span><div className="ds-buttons"><button className="ds-button ds-button-primary">Ver trabajos <b>↗</b></button><button className="ds-button ds-button-secondary">Conocer más <b>→</b></button><button className="ds-button ds-button-quiet">Cancelar</button><button className="ds-button ds-button-disabled" disabled>Deshabilitado</button></div></div><div className="ds-component-group"><span className="ds-component-label">CAMPO DE TEXTO</span><label className="ds-input-label" htmlFor="sample-email">Correo electrónico</label><input id="sample-email" className="ds-input" placeholder="nombre@ejemplo.com" /><small className="ds-input-hint">Usa una dirección válida.</small></div><div className="ds-component-group"><span className="ds-component-label">TARJETA DE OBRA</span><article className="ds-art-card"><div className="ds-art-placeholder"><span>ESPACIO PARA OBRA</span><i /></div><div className="ds-art-card-info"><div><small>ILUSTRACIÓN · SERIE</small><strong>Título de la obra</strong></div><span>↗</span></div></article></div></div>
        </section>

        <section id="layout" className="ds-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">07 / COMPOSICIÓN</p><h2>Layout y retícula</h2></div><p>Contenedor centrado, gutters fluidos y retícula que se simplifica en móvil.</p></div>
          <div className="ds-layout-sample"><div className="ds-layout-copy"><span>CONTENEDOR DE LECTURA</span><strong>El margen también<br />es parte del dibujo.</strong><small>Max-width 1200 px · gutters fluidos</small></div><div className="ds-layout-visual"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
          <div className="ds-breakpoints"><span><b>SM</b> 640 px · móvil amplio</span><span><b>MD</b> 768 px · tablet</span><span><b>LG</b> 1024 px · escritorio</span><span><b>XL</b> 1280 px · ancho</span></div>
        </section>

        <section id="movimiento" className="ds-section ds-last-section">
          <div className="ds-section-heading"><div><p className="ds-kicker">08 / RESPUESTA</p><h2>Movimiento y foco</h2></div><p>La interfaz responde sin competir con el contenido. Respeta preferencias de movimiento reducido.</p></div>
          <div className="ds-motion-board"><div><span className="ds-component-label">DURACIONES</span><p><i className="ds-motion-bar fast" /> Rápida <code>180 ms</code></p><p><i className="ds-motion-bar base" /> Base <code>280 ms</code></p></div><div><span className="ds-component-label">FOCO DE TECLADO</span><button className="ds-focus-demo">Prueba de foco <b>↗</b></button><small>Contorno de 3 px · offset 4 px</small></div><div><span className="ds-status-pill"><i /> PREFERENCIA RESPETADA</span><p className="ds-motion-caption">prefers-reduced-motion</p></div></div>
        </section>

        <footer className="ds-footer"><span>NEW SATO WEB <b>✳</b> DESIGN SYSTEM</span><span>Una base viva · Borrador 01</span><a href="#top">Volver arriba ↑</a></footer>
      </div>
    </main>
  );
}
import Link from "next/link";

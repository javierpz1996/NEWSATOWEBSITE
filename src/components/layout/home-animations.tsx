import Image from "next/image";

type AnimationWork = {
  id: string;
  number: string;
  title: string;
  src: `/works/animation/${string}`;
  alt: string;
};

const animationWorks: AnimationWork[] = [
  {
    id: "animation-1",
    number: "01",
    title: "Momentos fugaces",
    src: "/works/animation/animation5.gif",
    alt: "Animación de muestra 01: personaje en escena ilustrada en loop",
  },
  {
    id: "animation-2",
    number: "02",
    title: "Loop de estudio",
    src: "/works/animation/animation2.gif",
    alt: "Animación de muestra 02: loop de personaje en estudio de color",
  },
  {
    id: "animation-3",
    number: "03",
    title: "Secuencia suave",
    src: "/works/animation/animation3.gif",
    alt: "Animación de muestra 03: secuencia corta con transiciones suaves",
  },
  {
    id: "animation-4",
    number: "04",
    title: "Fragmento en movimiento",
    src: "/works/animation/animation4.gif",
    alt: "Animación de muestra 04: fragmento animado con fondo detallado",
  },
  {
    id: "animation-5",
    number: "05",
    title: "Loop en escena",
    src: "/works/animation/animation1.gif",
    alt: "Animación de muestra 05: loop animado en escena ilustrada",
  },
];

function workById(id: AnimationWork["id"]) {
  const work = animationWorks.find((item) => item.id === id);
  if (!work) throw new Error(`Missing animation work: ${id}`);
  return work;
}

const topRowWorks = [workById("animation-1"), workById("animation-3")];
const bottomRowWorks = [
  workById("animation-2"),
  workById("animation-4"),
  workById("animation-5"),
];

function AnimationTile({
  work,
  priority = false,
  sizes,
  variant,
}: {
  work: AnimationWork;
  priority?: boolean;
  sizes: string;
  variant: "featured" | "thumb";
}) {
  return (
    <figure
      className={`home-animations-tile home-animations-tile-${variant}`}
      aria-label={`Animación ${work.number}: ${work.title}`}
    >
      <span className="home-animations-tile-number">{work.number}</span>
      <Image
        className="home-animations-media-image"
        src={work.src}
        alt={work.alt}
        fill
        unoptimized
        sizes={sizes}
        priority={priority}
      />
    </figure>
  );
}

export function HomeAnimations() {
  return (
    <section
      id="animaciones"
      className="home-animations"
      aria-labelledby="home-animations-title"
      aria-describedby="home-animations-subtitle"
    >
      <header className="home-animations-header">
        <div className="home-animations-header-copy">
          <h2 id="home-animations-title">Animaciones</h2>
          <p id="home-animations-subtitle" className="home-animations-subtitle">
            Una pequeña selección de mis trabajos animados.
          </p>
        </div>
        <div className="home-animations-header-meta">
          <p className="home-animations-count">COMISIONES · PRÓXIMAMENTE</p>
          <p className="home-animations-tags">ANIMACIÓN · LOOP · MV · 2D</p>
        </div>
      </header>

      <div className="home-animations-grid">
        <div className="home-animations-row home-animations-row-top">
          {topRowWorks.map((work, index) => (
            <AnimationTile
              key={work.id}
              work={work}
              variant="featured"
              priority={index === 0}
              sizes="(max-width: 900px) 50vw, 780px"
            />
          ))}
        </div>
        <div className="home-animations-row home-animations-row-bottom">
          {bottomRowWorks.map((work) => (
            <AnimationTile
              key={work.id}
              work={work}
              variant="thumb"
              sizes="(max-width: 560px) 33vw, 520px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

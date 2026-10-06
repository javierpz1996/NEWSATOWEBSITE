export type SketchCarouselWork = {
  src: `/sketchs/${string}`;
  width: number;
  height: number;
};

function sketchSrc(filename: string): `/sketchs/${string}` {
  return `/sketchs/${encodeURIComponent(filename)}` as `/sketchs/${string}`;
}

/** Images in `public/sketchs/` — Bocetos service carousel. */
export const SKETCH_CAROUSEL_WORKS: readonly SketchCarouselWork[] = [
  { src: sketchSrc("111123123.png"), width: 1500, height: 1759 },
  { src: sketchSrc("1sato.png"), width: 1080, height: 1920 },
  {
    src: sketchSrc("Imagen de WhatsApp 2024-10-17 a las 19.59.31_fddaacdb.png"),
    width: 834,
    height: 901,
  },
  { src: sketchSrc("Pelagia Noctiluca.png"), width: 1000, height: 1500 },
  { src: sketchSrc("asdasdasf.png"), width: 1191, height: 1387 },
  { src: sketchSrc("boceto2.png"), width: 3000, height: 2913 },
  { src: sketchSrc("milo.png"), width: 2000, height: 2306 },
  { src: sketchSrc("world ends dancing.png"), width: 1008, height: 992 },
  { src: sketchSrc("zacksito test.png"), width: 1230, height: 1280 },
];

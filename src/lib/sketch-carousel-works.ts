export type SketchCarouselWork = {
  src: `/imageslight/sketchDibujo/${string}`;
  width: number;
  height: number;
};

function sketchSrc(filename: string): `/imageslight/sketchDibujo/${string}` {
  return `/imageslight/sketchDibujo/${encodeURIComponent(filename)}` as `/imageslight/sketchDibujo/${string}`;
}

/** All images in `public/imageslight/sketchDibujo/` — Bocetos service carousel. */
export const SKETCH_CAROUSEL_WORKS: readonly SketchCarouselWork[] = [
  { src: sketchSrc("1.png"), width: 500, height: 889 },
  { src: sketchSrc("2.jpg"), width: 1500, height: 1759 },
  { src: sketchSrc("3.jpg"), width: 600, height: 699 },
  { src: sketchSrc("4.jpg"), width: 800, height: 777 },
  { src: sketchSrc("5.png"), width: 834, height: 901 },
  { src: sketchSrc("6.jpg"), width: 800, height: 922 },
  { src: sketchSrc("7.png"), width: 1000, height: 1500 },
  { src: sketchSrc("8.png"), width: 1008, height: 992 },
  { src: sketchSrc("9.png"), width: 1230, height: 1280 },
];

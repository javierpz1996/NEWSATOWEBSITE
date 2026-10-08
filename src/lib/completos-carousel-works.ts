export type CompletosCarouselWork = {
  src: `/imageslight/completos/${string}`;
  width: number;
  height: number;
};

function completosSrc(filename: string): `/imageslight/completos/${string}` {
  return `/imageslight/completos/${encodeURIComponent(filename)}` as `/imageslight/completos/${string}`;
}

/** All images in `public/imageslight/completos/` — Completos service carousel. */
export const COMPLETOS_CAROUSEL_WORKS: readonly CompletosCarouselWork[] = [
  { src: completosSrc("1.jpg"), width: 600, height: 611 },
  { src: completosSrc("2.jpg"), width: 1500, height: 1045 },
  { src: completosSrc("3.jpg"), width: 600, height: 694 },
  { src: completosSrc("4.jpg"), width: 700, height: 810 },
  { src: completosSrc("5.jpg"), width: 700, height: 936 },
  { src: completosSrc("6.png"), width: 1301, height: 1505 },
  { src: completosSrc("7.jpg"), width: 900, height: 1758 },
  { src: completosSrc("8.png"), width: 1286, height: 1899 },
];

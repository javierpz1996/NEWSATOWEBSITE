export type SimplistaCarouselWork = {
  src: `/imageslight/simplista/${string}`;
  width: number;
  height: number;
};

function simplistaSrc(filename: string): `/imageslight/simplista/${string}` {
  return `/imageslight/simplista/${encodeURIComponent(filename)}` as `/imageslight/simplista/${string}`;
}

/** All images in `public/imageslight/simplista/` — Simplista coloreado service carousel. */
export const SIMPLISTA_CAROUSEL_WORKS: readonly SimplistaCarouselWork[] = [
  { src: simplistaSrc("1.png"), width: 468, height: 623 },
  { src: simplistaSrc("2.jpg"), width: 600, height: 692 },
  { src: simplistaSrc("3.png"), width: 468, height: 623 },
  { src: simplistaSrc("4.jpg"), width: 700, height: 1041 },
  { src: simplistaSrc("5.png"), width: 1230, height: 1280 },
  { src: simplistaSrc("6.png"), width: 1230, height: 1280 },
  { src: simplistaSrc("7.png"), width: 1196, height: 1600 },
  { src: simplistaSrc("8.png"), width: 2080, height: 2400 },
];

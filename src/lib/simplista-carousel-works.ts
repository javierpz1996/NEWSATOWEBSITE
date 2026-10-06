export type SimplistaCarouselWork = {
  src: `/simplista/${string}`;
  width: number;
  height: number;
};

function simplistaSrc(filename: string): `/simplista/${string}` {
  return `/simplista/${encodeURIComponent(filename)}` as `/simplista/${string}`;
}

/** All images in `public/simplista/` — used by the Simplista coloreado service carousel. */
export const SIMPLISTA_CAROUSEL_WORKS: readonly SimplistaCarouselWork[] = [
  { src: simplistaSrc("AADASDADS.png"), width: 468, height: 623 },
  { src: simplistaSrc("ADSASDSAFASF.png"), width: 468, height: 623 },
  { src: simplistaSrc("adasda.png"), width: 2080, height: 2400 },
  { src: simplistaSrc("bastaaaaaa2.png"), width: 2461, height: 3659 },
  { src: simplistaSrc("booty.png"), width: 1230, height: 1280 },
  { src: simplistaSrc("moridiendo el hijod e mil puta.png"), width: 1230, height: 1280 },
  { src: simplistaSrc("no lo seeeee.png"), width: 1196, height: 1600 },
  { src: simplistaSrc("zackchiquito3.png"), width: 2080, height: 2400 },
];

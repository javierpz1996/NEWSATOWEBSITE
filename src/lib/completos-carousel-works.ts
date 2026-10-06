export type CompletosCarouselWork = {
  src: `/completos/${string}`;
  width: number;
  height: number;
};

function completosSrc(filename: string): `/completos/${string}` {
  return `/completos/${encodeURIComponent(filename)}` as `/completos/${string}`;
}

/** Images in `public/completos/` — Completos service carousel. */
export const COMPLETOS_CAROUSEL_WORKS: readonly CompletosCarouselWork[] = [
  { src: completosSrc("PNG CONEJO FONDO BLANCO Y SOMBRA.png"), width: 2453, height: 4791 },
  { src: completosSrc("arte.png"), width: 2195, height: 2234 },
  { src: completosSrc("correcion de colores.png"), width: 3334, height: 2322 },
  { src: completosSrc("fondo sin blur.png"), width: 1301, height: 1505 },
  { src: completosSrc("gino comision 2.png"), width: 1301, height: 1505 },
  { src: completosSrc("gino1.png"), width: 1799, height: 1660 },
  { src: completosSrc("kasane teto sin  firma.png"), width: 1196, height: 1600 },
  { src: completosSrc("otro ojo.png"), width: 1301, height: 1505 },
  { src: completosSrc("remera azul.png"), width: 1286, height: 1899 },
];

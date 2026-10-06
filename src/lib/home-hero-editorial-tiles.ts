const HERO_EDITORIAL_TILE_THIRD = "/works/placeholder/dibujo-1.png" as const;

export type HomeHeroEditorialTile = {
  id: string;
  src: `/hero/${string}` | typeof HERO_EDITORIAL_TILE_THIRD;
  /** Scale cover crop — trims baked-in letterbox margins on the asset. */
  bleedCover?: boolean;
};

/** Hero bar editorial tiles (left → right). */
export const HOME_HERO_EDITORIAL_TILES: readonly HomeHeroEditorialTile[] = [
  { id: "01", src: "/hero/1.PNG" },
  { id: "02", src: "/hero/2.PNG", bleedCover: true },
  { id: "03", src: HERO_EDITORIAL_TILE_THIRD },
];

export const HOME_INTRO_HERO_TILE_SRCS = HOME_HERO_EDITORIAL_TILES.map((tile) => tile.src);

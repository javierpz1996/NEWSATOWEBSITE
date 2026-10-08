function animationSrc(filename: string): `/imageslight/animaciones/${string}` {
  return `/imageslight/animaciones/${encodeURIComponent(filename)}` as `/imageslight/animaciones/${string}`;
}

/** Loop videos in `public/imageslight/animaciones/` — Próximamente grid. */
export const HOME_ANIMATION_SRC_BY_ID: Record<
  `animation-${1 | 2 | 3 | 4 | 5}`,
  `/imageslight/animaciones/${string}`
> = {
  "animation-1": animationSrc("Animacion1.m4v"),
  "animation-2": animationSrc("Booty.m4v"),
  "animation-3": animationSrc("Animacion3.m4v"),
  "animation-4": animationSrc("Ludmila.m4v"),
  "animation-5": animationSrc("Animacion5.m4v"),
};

export function isHomeAnimationVideoSrc(src: string): boolean {
  return /\.(m4v|mp4|webm)$/i.test(src);
}

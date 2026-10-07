/** Official social profile URLs (artist-provided). */
export const ARTIST_SOCIAL_URLS = {
  instagram: "https://www.instagram.com/sato.ubi/",
  x: "https://x.com/satito_",
  youtube: "https://www.youtube.com/@sato.canvas",
  tiktok: "https://www.tiktok.com/@satito_",
  deviantart: "https://www.deviantart.com/satodibuja",
  cafecito: "https://cafecito.app/satito",
} as const;

/** Public Cafecito profile — keep in sync with `ARTIST_SOCIAL_URLS.cafecito`. */
export const CAFECITO_PROFILE_URL = ARTIST_SOCIAL_URLS.cafecito;

/** Round mark for Cafecito (source: cdn.cafecito.app). */
export const CAFECITO_LOGO_SRC = "/works/placeholder/cafecito-logo-round.png" as const;

export type ArtistSocialId = keyof typeof ARTIST_SOCIAL_URLS;

export function isArtistSocialExternalUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

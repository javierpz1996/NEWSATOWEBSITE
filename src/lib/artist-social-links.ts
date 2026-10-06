/** Official social profile URLs (artist-provided). */
export const ARTIST_SOCIAL_URLS = {
  instagram: "https://www.instagram.com/sato.ubi/",
  x: "https://x.com/satito_",
  youtube: "https://www.youtube.com/@sato.canvas",
  tiktok: "https://www.tiktok.com/@satito_",
  deviantart: "https://www.deviantart.com/satodibuja",
} as const;

export type ArtistSocialId = keyof typeof ARTIST_SOCIAL_URLS;

export function isArtistSocialExternalUrl(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

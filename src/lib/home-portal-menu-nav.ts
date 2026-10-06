import { ARTIST_SOCIAL_URLS } from "@/lib/artist-social-links";

export type HomePortalMenuNavItem = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  isActive?: boolean;
  comingSoon?: string;
};

export type HomePortalMenuNavColumn = HomePortalMenuNavItem[];

/** Placeholder nav — labels mirror the Frieren-style grid; hrefs point at home sections. */
export const HOME_PORTAL_MENU_NAV_COLUMNS: HomePortalMenuNavColumn[] = [
  [
    { id: "animation", label: "ANIMATION", sublabel: "アニメ", href: "#animaciones" },
    { id: "commissions", label: "COMMISSIONS", sublabel: "コミッション", href: "#comisiones" },
    { id: "contact", label: "CONTACT", sublabel: "お問い合わせ", href: "#contacto" },
    {
      id: "gallery",
      label: "GALLERY",
      sublabel: "ギャラリー",
      href: "#animaciones",
      comingSoon: "Coming soon",
    },
    { id: "services", label: "SERVICES", sublabel: "サービス", href: "#comisiones" },
  ],
  [
    {
      id: "about",
      label: "ABOUT",
      sublabel: "プロフィール",
      href: "#inicio",
      comingSoon: "Coming soon",
    },
    { id: "sns", label: "SOCIAL", sublabel: "SNS", href: "#home-sns" },
    { id: "official-x", label: "X (Twitter)", sublabel: "公式X", href: ARTIST_SOCIAL_URLS.x },
    { id: "official-ig", label: "INSTAGRAM", sublabel: "公式Instagram", href: ARTIST_SOCIAL_URLS.instagram },
    { id: "official-yt", label: "YOUTUBE", sublabel: "公式YouTube", href: ARTIST_SOCIAL_URLS.youtube },
    { id: "official-tiktok", label: "TIKTOK", sublabel: "公式TikTok", href: ARTIST_SOCIAL_URLS.tiktok },
    {
      id: "official-da",
      label: "DEVIANTART",
      sublabel: "公式DeviantArt",
      href: ARTIST_SOCIAL_URLS.deviantart,
    },
  ],
];

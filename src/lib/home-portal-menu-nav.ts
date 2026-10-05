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
    { id: "sns", label: "SOCIAL", sublabel: "SNS", href: "#inicio" },
    { id: "official-x", label: "X (Twitter)", sublabel: "公式X", href: "#" },
    { id: "official-ig", label: "INSTAGRAM", sublabel: "公式Instagram", href: "#" },
    { id: "official-yt", label: "YOUTUBE", sublabel: "公式YouTube", href: "#" },
  ],
];

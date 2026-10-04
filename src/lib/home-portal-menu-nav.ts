export type HomePortalMenuNavItem = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  isActive?: boolean;
};

export type HomePortalMenuNavColumn = HomePortalMenuNavItem[];

/** Placeholder nav — labels mirror the Frieren-style grid; hrefs point at home sections. */
export const HOME_PORTAL_MENU_NAV_COLUMNS: HomePortalMenuNavColumn[] = [
  [
    { id: "top", label: "TOP", sublabel: "トップ", href: "#inicio", isActive: true },
    { id: "works", label: "WORKS", sublabel: "作品", href: "#animaciones" },
    { id: "animation", label: "ANIMATION", sublabel: "アニメ", href: "#animaciones" },
    { id: "commissions", label: "COMMISSIONS", sublabel: "コミッション", href: "#comisiones" },
    { id: "contact", label: "CONTACT", sublabel: "お問い合わせ", href: "#contacto" },
  ],
  [
    { id: "services", label: "SERVICES", sublabel: "サービス", href: "#comisiones" },
    { id: "gallery", label: "GALLERY", sublabel: "ギャラリー", href: "#inicio" },
    { id: "about", label: "ABOUT", sublabel: "プロフィール", href: "#inicio" },
    { id: "sns", label: "SOCIAL", sublabel: "SNS", href: "#inicio" },
    { id: "design", label: "DESIGN SYSTEM", sublabel: "ビジュアル", href: "/desing-system" },
  ],
  [
    { id: "special", label: "SPECIAL", sublabel: "スペシャル", href: "#inicio" },
    { id: "official-x", label: "OFFICIAL X", sublabel: "公式X", href: "#" },
    { id: "official-ig", label: "OFFICIAL Instagram", sublabel: "公式Instagram", href: "#" },
    { id: "official-yt", label: "OFFICIAL YouTube", sublabel: "公式YouTube", href: "#" },
  ],
];

export const HOME_PORTAL_MENU_SHARE_LINKS = [
  { id: "share-x", label: "X", href: "#" },
  { id: "share-ig", label: "Instagram", href: "#" },
  { id: "share-mail", label: "Email", href: "mailto:hola@example.com" },
] as const;

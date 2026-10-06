import type { HomeMessages } from "@/lib/home-messages/types";

export type HomePortalMenuNavItem = {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  isActive?: boolean;
  comingSoon?: string;
};

export type HomePortalMenuNavColumn = HomePortalMenuNavItem[];

export function buildHomePortalMenuNavColumns(
  portal: HomeMessages["portal"],
): HomePortalMenuNavColumn[] {
  const soon = portal.modal.comingSoon;
  const nav = portal.nav;

  return [
    [
      {
        id: "animation",
        label: nav.animation.label,
        sublabel: nav.animation.sublabel,
        href: "#animaciones",
        comingSoon: soon,
      },
      {
        id: "commissions",
        label: nav.commissions.label,
        sublabel: nav.commissions.sublabel,
        href: "#comisiones",
      },
      {
        id: "contact",
        label: nav.contact.label,
        sublabel: nav.contact.sublabel,
        href: "#contacto",
      },
    ],
    [
      {
        id: "about",
        label: nav.about.label,
        sublabel: nav.about.sublabel,
        href: "#inicio",
        comingSoon: soon,
      },
      {
        id: "rules",
        label: nav.rules.label,
        sublabel: nav.rules.sublabel,
        href: "/rules",
      },
      {
        id: "more-info",
        label: nav.moreInfo.label,
        sublabel: nav.moreInfo.sublabel,
        href: "/more-info",
      },
      {
        id: "gallery",
        label: nav.gallery.label,
        sublabel: nav.gallery.sublabel,
        href: "#animaciones",
        comingSoon: soon,
      },
    ],
  ];
}

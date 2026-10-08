"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useHomeMessages } from "@/hooks/use-home-messages";
import {
  ARTIST_SOCIAL_URLS,
  CAFECITO_LOGO_SRC,
  CAFECITO_PROFILE_URL,
} from "@/lib/artist-social-links";

type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
};

function SnsSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} aria-hidden focusable="false">
      {children}
    </svg>
  );
}

function IconInstagram() {
  return (
    <SnsSvg>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.25" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </SnsSvg>
  );
}

function IconX() {
  return (
    <SnsSvg>
      <path
        fill="currentColor"
        d="M13.527 10.896 20.792 3h-2.065l-6.331 7.278L7.479 3H3.214l7.571 10.932L3.214 21h2.065l6.785-7.804 5.429 7.804h4.265l-7.231-10.004Zm-2.489 2.591-.776-1.12-6.241-8.987h2.652l5.038 7.224.776 1.12 6.203 8.883h-2.652l-5.1-7.32Z"
      />
    </SnsSvg>
  );
}

function IconYoutube() {
  return (
    <SnsSvg>
      <path
        fill="currentColor"
        d="M21.58 7.16a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.39a2.5 2.5 0 0 0-1.76 1.77A26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.84 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.39a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.84ZM10 15.02V8.98L15.45 12 10 15.02Z"
      />
    </SnsSvg>
  );
}

function IconTikTok() {
  return (
    <SnsSvg>
      <path
        fill="currentColor"
        d="M16.5 5.5c.9 1.1 2.2 1.9 3.7 2.1v3.1c-1.3-.04-2.5-.5-3.5-1.2v6.8c0 3.2-2.6 5.8-5.8 5.8S5.1 19.5 5.1 16.3s2.6-5.8 5.8-5.8c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.1-.9-.1-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5V2h3.1c.1 1.2.7 2.3 1.6 3.5Z"
      />
    </SnsSvg>
  );
}

function IconDeviantArt() {
  return (
    <SnsSvg>
      <path
        fill="currentColor"
        d="M19.207 4.794l.23-.43V0H15.07l-.436.44-2.058 3.925-.646.436H4.58v5.993h4.04l.36.436-4.175 7.98-.24.43V24H8.93l.436-.44 2.07-3.925.644-.436h7.35v-5.993h-4.05l-.36-.438 4.186-7.977z"
      />
    </SnsSvg>
  );
}

const socialLinks: SocialLink[] = [
  { id: "instagram", label: "Instagram", href: ARTIST_SOCIAL_URLS.instagram, icon: <IconInstagram /> },
  { id: "x", label: "Twitter", href: ARTIST_SOCIAL_URLS.x, icon: <IconX /> },
  { id: "youtube", label: "Youtube", href: ARTIST_SOCIAL_URLS.youtube, icon: <IconYoutube /> },
  { id: "tiktok", label: "TikTok", href: ARTIST_SOCIAL_URLS.tiktok, icon: <IconTikTok /> },
  {
    id: "deviantart",
    label: "DeviantArt",
    href: ARTIST_SOCIAL_URLS.deviantart,
    icon: <IconDeviantArt />,
  },
  {
    id: "cafecito",
    label: "Cafecito",
    href: CAFECITO_PROFILE_URL,
    imageSrc: CAFECITO_LOGO_SRC,
    imageAlt: "Cafecito",
  },
];

function SocialLinkItem({ link }: { link: SocialLink }) {
  return (
    <li>
      <a
        className="home-sns-link"
        href={link.href}
        data-brand={link.id}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="home-sns-icon">
          {link.imageSrc ? (
            <Image
              className="home-sns-icon-image"
              src={link.imageSrc}
              alt={link.imageAlt ?? link.label}
              width={500}
              height={461}
              sizes="(max-width: 760px) 20px, 36px"
            />
          ) : (
            link.icon
          )}
        </span>
        <span className="home-sns-label">{link.label}</span>
      </a>
    </li>
  );
}

export function HomeSnsBar() {
  const { sns } = useHomeMessages();
  return (
    <section id="home-sns" className="home-sns" aria-label={sns.sectionAria}>
      <div className="home-sns-inner">
        <div className="home-sns-frame" aria-hidden="true">
          <span className="home-sns-corner home-sns-corner-tl" />
          <span className="home-sns-corner home-sns-corner-tr" />
          <span className="home-sns-corner home-sns-corner-bl" />
          <span className="home-sns-corner home-sns-corner-br" />
        </div>
        <div className="home-sns-rows">
          <ul className="home-sns-row home-sns-row-single">
            {socialLinks.map((link) => (
              <SocialLinkItem key={link.id} link={link} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

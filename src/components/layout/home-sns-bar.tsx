import type { ReactNode } from "react";

type SocialLink = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
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
  { id: "instagram", label: "Instagram", href: "#", icon: <IconInstagram /> },
  { id: "x", label: "Twitter", href: "#", icon: <IconX /> },
  { id: "youtube", label: "Youtube", href: "#", icon: <IconYoutube /> },
  { id: "deviantart", label: "DeviantArt", href: "#", icon: <IconDeviantArt /> },
];

function SocialLinkItem({ link }: { link: SocialLink }) {
  return (
    <li>
      <a className="home-sns-link" href={link.href}>
        <span className="home-sns-icon">{link.icon}</span>
        <span className="home-sns-label">{link.label}</span>
      </a>
    </li>
  );
}

export function HomeSnsBar() {
  return (
    <section id="home-sns" className="home-sns" aria-label="Redes sociales">
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

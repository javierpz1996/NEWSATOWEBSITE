type HomePortalMenuKanjiArrowProps = {
  className?: string;
};

export function HomePortalMenuKanjiArrow({ className }: HomePortalMenuKanjiArrowProps) {
  const classes = ["home-portal-menu-kanji-arrow", className].filter(Boolean).join(" ");

  return (
    <span className={classes} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 7 L9 12 L15 17"
          stroke="currentColor"
          strokeWidth="4.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

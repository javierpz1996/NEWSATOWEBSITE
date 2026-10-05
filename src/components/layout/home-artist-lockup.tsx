export function HomeArtistLockup() {
  return (
    <div className="home-artist-lockup home-intro-reveal-lockup">
      <div className="home-artist-lockup-stack">
        <p className="home-artist-name home-artist-lockup-line home-artist-lockup-line--name">
          SATO
        </p>
        <h1 className="home-artist-kanji home-artist-lockup-line home-artist-lockup-line--kanji">
          佐藤
        </h1>
        <p className="home-artist-role home-artist-lockup-line home-artist-lockup-line--role">
          Anime &amp; Illustration Artist
        </p>
        <p className="home-artist-location home-artist-lockup-line home-artist-lockup-line--location">
          <span className="home-artist-location-flag" aria-hidden="true">
            <svg viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="14" fill="#74ACDF" />
              <rect y="4.667" width="20" height="4.667" fill="#FFFFFF" />
              <circle cx="10" cy="7" r="1.85" fill="#F6B40E" stroke="#85340A" strokeWidth="0.4" />
              <g stroke="#85340A" strokeWidth="0.32" strokeLinecap="round">
                <path d="M10 4.95V5.9M10 8.1v.95M7.1 7h.9M12 7h.9" />
                <path d="M8 5.35l.63.63M11.37 8.72l.63.63M8 8.65l.63-.63M11.37 5.28l.63-.63" />
              </g>
            </svg>
          </span>
          <span className="home-artist-location-label">Argentina</span>
        </p>
      </div>
    </div>
  );
}

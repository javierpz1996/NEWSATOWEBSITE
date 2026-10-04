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
          <span className="home-artist-location-pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="10"
                r="2.25"
                stroke="currentColor"
                strokeWidth="1.75"
                fill="none"
              />
            </svg>
          </span>
          <span className="home-artist-location-flag" aria-hidden="true">
            🇦🇷
          </span>
          <span className="home-artist-location-label">Argentina</span>
        </p>
      </div>
    </div>
  );
}

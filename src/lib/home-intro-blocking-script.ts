import { HOME_INTRO_SESSION_KEY } from "@/lib/home-intro-assets";

/**
 * Synchronous boot script: mirrors resolveHomeIntroPolicy() so the first paint
 * never shows the home page before the intro overlay mounts.
 */
export function getHomeIntroBlockingScriptContent(): string {
  const sessionKey = HOME_INTRO_SESSION_KEY;
  return `(function(){
  try {
    var path = location.pathname;
    if (path !== "/" && path !== "") return;
    var params = new URLSearchParams(location.search);
    var intro = params.get("intro");
    if (intro === "off") return;
    if (location.hash.length > 1) return;
    if (intro === "reset" || intro === "1" || intro === "loop") {
      try { sessionStorage.removeItem("${sessionKey}"); } catch (e) {}
    }
    if (intro === "loop") {
      document.documentElement.classList.add("home-intro-play");
      document.body.style.overflow = "hidden";
      return;
    }
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced && intro !== "1" && intro !== "reset" && intro !== "loop") return;
    if (intro === "1" || intro === "reset") {
      document.documentElement.classList.add("home-intro-play");
      document.body.style.overflow = "hidden";
      return;
    }
    try {
      if (sessionStorage.getItem("${sessionKey}") === "1") return;
    } catch (e) {
      return;
    }
    document.documentElement.classList.add("home-intro-play");
    document.body.style.overflow = "hidden";
    if (window.matchMedia && window.matchMedia("(max-width: 760px)").matches) {
      var vv = window.visualViewport && window.visualViewport.height;
      var heroH = Math.max(window.innerHeight, vv || 0);
      document.documentElement.style.setProperty("--home-hero-stable-height", Math.round(heroH) + "px");
    }
  } catch (e) {}
})();`;
}

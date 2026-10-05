import { HOME_CART_BUTTON_ID } from "@/lib/home-cart";

const FLY_DURATION_MS = 520;
const FLY_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";
const FLY_SIZE_PX = 28;
const LANDED_CLASS = "home-cart-icon-button--landed";
const LANDED_MS = 380;

function resolveCartFlyTarget(): HTMLElement | null {
  const stickyButton = document.querySelector(
    ".home-sticky-cart .home-cart-icon-button",
  );
  if (stickyButton instanceof HTMLElement) {
    return stickyButton;
  }
  const headerButton = document.getElementById(HOME_CART_BUTTON_ID);
  return headerButton instanceof HTMLElement ? headerButton : null;
}

function createFlyElement(): HTMLDivElement {
  const fly = document.createElement("div");
  fly.className = "home-cart-fly";
  fly.setAttribute("aria-hidden", "true");
  fly.innerHTML = `<span class="home-cart-fly__icon" aria-hidden="true"></span>`;
  return fly;
}

export function runHomeCartFlyAnimation(source: HTMLElement): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const target = resolveCartFlyTarget();
  if (!target) return;

  const fromRect = source.getBoundingClientRect();
  const toRect = target.getBoundingClientRect();
  if (fromRect.width === 0 || toRect.width === 0) return;

  const fly = createFlyElement();
  document.body.appendChild(fly);

  const startX = fromRect.left + fromRect.width / 2 - FLY_SIZE_PX / 2;
  const startY = fromRect.top + fromRect.height / 2 - FLY_SIZE_PX / 2;
  const endX = toRect.left + toRect.width / 2 - FLY_SIZE_PX / 2;
  const endY = toRect.top + toRect.height / 2 - FLY_SIZE_PX / 2;
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const arcLiftY = Math.min(-56, deltaY * -0.35);

  Object.assign(fly.style, {
    position: "fixed",
    left: `${startX}px`,
    top: `${startY}px`,
    width: `${FLY_SIZE_PX}px`,
    height: `${FLY_SIZE_PX}px`,
    zIndex: "30",
    pointerEvents: "none",
  });

  const animation = fly.animate(
    [
      { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
      {
        transform: `translate3d(${deltaX * 0.45}px, ${deltaY * 0.45 + arcLiftY}px, 0) scale(1.12)`,
        opacity: 1,
        offset: 0.5,
      },
      { transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.82)`, opacity: 0.92 },
    ],
    { duration: FLY_DURATION_MS, easing: FLY_EASING, fill: "forwards" },
  );

  animation.onfinish = () => {
    fly.remove();
    target.classList.add(LANDED_CLASS);
    window.setTimeout(() => target.classList.remove(LANDED_CLASS), LANDED_MS);
  };

  animation.oncancel = () => {
    fly.remove();
  };
}

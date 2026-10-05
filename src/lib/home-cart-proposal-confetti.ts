const CONFETTI_DURATION_MS = 2200;
const CONFETTI_PARTICLE_COUNT = 96;

/** Muted palette — reads fine on light/dark home backdrops. */
const CONFETTI_COLORS = [
  "oklch(0.72 0.14 12)",
  "oklch(0.78 0.12 145)",
  "oklch(0.82 0.11 85)",
  "oklch(0.7 0.1 250)",
  "oklch(0.75 0.08 320)",
] as const;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rotation: number;
  spin: number;
  color: string;
  life: number;
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function createParticles(originX: number, originY: number): Particle[] {
  return Array.from({ length: CONFETTI_PARTICLE_COUNT }, () => {
    const angle = randomBetween(-Math.PI, 0);
    const speed = randomBetween(4.5, 11);
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - randomBetween(2, 6),
      w: randomBetween(5, 9),
      h: randomBetween(3, 7),
      rotation: randomBetween(0, Math.PI * 2),
      spin: randomBetween(-0.22, 0.22),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      life: 1,
    };
  });
}

export function fireHomeCartProposalConfetti(anchor?: HTMLElement | null): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.className = "home-cart-confetti-canvas";
  const context = canvas.getContext("2d");
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  document.body.appendChild(canvas);

  const anchorRect = anchor?.getBoundingClientRect();
  const originX = anchorRect
    ? anchorRect.left + anchorRect.width / 2
    : width / 2;
  const originY = anchorRect
    ? anchorRect.top + anchorRect.height * 0.35
    : height * 0.4;

  const particles = createParticles(originX, originY);
  const startedAt = performance.now();

  const frame = (now: number) => {
    const elapsed = now - startedAt;
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.vy += 0.18;
      particle.vx *= 0.99;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.spin;
      particle.life = Math.max(0, 1 - elapsed / CONFETTI_DURATION_MS);

      context.save();
      context.globalAlpha = particle.life;
      context.translate(particle.x, particle.y);
      context.rotate(particle.rotation);
      context.fillStyle = particle.color;
      context.fillRect(-particle.w / 2, -particle.h / 2, particle.w, particle.h);
      context.restore();
    }

    if (elapsed < CONFETTI_DURATION_MS) {
      requestAnimationFrame(frame);
      return;
    }

    canvas.remove();
  };

  requestAnimationFrame(frame);
}

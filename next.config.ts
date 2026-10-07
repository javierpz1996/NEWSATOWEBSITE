import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/reglas", destination: "/rules", permanent: true },
      { source: "/open-work", destination: "/new-work", permanent: false },
    ];
  },
  experimental: {
    // El volumen del proyecto es ExFAT y la caché FS de Turbopack se corrompe
    // ("Failed to open database … invalid digit found in string"), lo que rompe
    // `next dev` y `next build`. Se desactiva la persistencia entre corridas.
    // Ver PLAN.md → Notas del entorno. Docs: node_modules/next/dist/docs/
    // 01-app/03-api-reference/05-config/01-next-config-js/turbopackFileSystemCache.md
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: false,
  },
};

export default nextConfig;

# NewSatoWeb

Portfolio personal de una artista/dibujante. Next.js 16 · TypeScript · Tailwind CSS v4 ·
shadcn/ui · español e inglés · sitio 100% estático, deploy en Vercel.

## Empezar

```bash
export PATH="$HOME/.local/bin:$PATH"   # pnpm vive en ~/.local/bin
pnpm install
pnpm dev                                # http://localhost:3000 (o 3001 si está ocupado)
```

## Comandos

```bash
pnpm dev        # dev server (Turbopack)
pnpm build      # build de producción
pnpm lint       # ESLint
pnpm typecheck  # tsc --noEmit
```

Los tres últimos deben quedar en verde antes de dar por terminado un cambio.

## Documentación

| Qué | Dónde |
|---|---|
| Reglas para agentes de código | [`AGENTS.md`](AGENTS.md) |
| Plan, fases y estado del proyecto | [`PLAN.md`](PLAN.md) |
| Decisiones técnicas (por qué) | [`docs/adr/`](docs/adr/) |
| Glosario | [`docs/glosario.md`](docs/glosario.md) |
| Design system (pendiente) | [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) |

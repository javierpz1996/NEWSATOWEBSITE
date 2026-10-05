/** Placeholder showcase for active commissions on the home page. */
export type HomeCommissionInProgress = {
  id: string;
  statusLabel: string;
  serviceTitle: string;
  clientDisplay: string;
  startedLabel: string;
  startedOn: string;
  etaLabel: string;
  etaOn: string;
};

export const homeCommissionsInProgressPlaceholders: HomeCommissionInProgress[] = [
  {
    id: "placeholder-1",
    statusLabel: "En curso",
    serviceTitle: "Simplista coloreado",
    clientDisplay: "Tipo: NSFW",
    startedLabel: "Inicio",
    startedOn: "Mar 2026",
    etaLabel: "Entrega estimada",
    etaOn: "Abr 2026",
  },
  {
    id: "placeholder-2",
    statusLabel: "En curso",
    serviceTitle: "Bust up detallado",
    clientDisplay: "Tipo: SFW",
    startedLabel: "Inicio",
    startedOn: "Feb 2026",
    etaLabel: "Entrega estimada",
    etaOn: "Mar 2026",
  },
  {
    id: "placeholder-3",
    statusLabel: "En curso",
    serviceTitle: "Hoja de poses",
    clientDisplay: "Tipo: SFW",
    startedLabel: "Inicio",
    startedOn: "Ene 2026",
    etaLabel: "Entrega estimada",
    etaOn: "Feb 2026",
  },
];

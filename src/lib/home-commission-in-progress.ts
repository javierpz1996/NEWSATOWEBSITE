/** Active commission card on the home page (loaded from Supabase). */
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

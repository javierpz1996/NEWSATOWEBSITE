type CommissionStep = {
  number: string;
  title: string;
  description: string;
};

const commissionSteps: CommissionStep[] = [
  {
    number: "01",
    title: "Contacto",
    description:
      "Contactame a través de mis redes sociales y contame tu idea, qué comisión querés y enviame tus referencias.",
  },
  {
    number: "02",
    title: "Boceto",
    description:
      "Una vez aceptada la comisión y recibido el pago inicial, realizaré el boceto para que puedas revisarlo y solicitar correcciones.",
  },
  {
    number: "03",
    title: "Ilustración final",
    description:
      "Con el boceto aprobado, continuaré con el lineart, colores, sombras, iluminación y detalles finales.",
  },
  {
    number: "04",
    title: "Entrega",
    description:
      "Una vez terminado el trabajo y recibido el pago restante, recibirás los archivos finales de tu comisión.",
  },
];

export function HomeCommissionsOpen() {
  return (
    <section
      id="comisiones"
      className="home-commissions-open"
      aria-labelledby="home-commissions-open-title"
      aria-describedby="home-commissions-open-subtitle"
    >
      <header className="home-commissions-open-header">
        <h2 id="home-commissions-open-title">Comisiones abiertas</h2>
        <p id="home-commissions-open-subtitle" className="home-commissions-open-subtitle">
          Convertí tu idea en una ilustración
        </p>
      </header>
      <ol className="home-commissions-steps">
        {commissionSteps.map((step) => (
          <li key={step.number}>
            <article className="home-commissions-step">
              <div className="home-commissions-step-frame" aria-hidden="true">
                <span className="home-commissions-step-corner home-commissions-step-corner-tl" />
                <span className="home-commissions-step-corner home-commissions-step-corner-tr" />
                <span className="home-commissions-step-corner home-commissions-step-corner-bl" />
                <span className="home-commissions-step-corner home-commissions-step-corner-br" />
              </div>
              <div className="home-commissions-step-heading">
                <p className="home-commissions-step-number">{step.number}</p>
                <h3 className="home-commissions-step-title">{step.title}</h3>
              </div>
              <p className="home-commissions-step-description">{step.description}</p>
            </article>
          </li>
        ))}
      </ol>
      <div className="home-commissions-rules-notice" role="note">
        <div className="home-commissions-step-frame" aria-hidden="true">
          <span className="home-commissions-step-corner home-commissions-step-corner-tl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-tr" />
          <span className="home-commissions-step-corner home-commissions-step-corner-bl" />
          <span className="home-commissions-step-corner home-commissions-step-corner-br" />
        </div>
        <div className="home-commissions-rules-notice-leading">
          <div className="home-commissions-rules-notice-warning" aria-hidden="true">
            <svg viewBox="0 0 96 82" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M48 7 87.5 73.5c1.8 3.1-.5 7-3.9 7H12.4c-3.4 0-5.7-3.9-3.9-7L48 7Z"
                fill="var(--home-warning-sign-fill)"
                stroke="var(--home-warning-sign-ink)"
                strokeWidth="5"
                strokeLinejoin="round"
              />
              <rect
                x="44"
                y="27"
                width="8"
                height="28"
                rx="4"
                fill="var(--home-warning-sign-ink)"
              />
              <circle cx="48" cy="63.5" r="4.5" fill="var(--home-warning-sign-ink)" />
            </svg>
            <span className="home-commissions-rules-notice-warning-label">危険</span>
          </div>
          <span className="home-commissions-rules-notice-divider" aria-hidden="true" />
        </div>
        <p className="home-commissions-rules-notice-text">
          Antes de solicitar una comisión, revisá las <strong>reglas</strong> de comisiones.
        </p>
        <a className="home-commissions-rules-notice-cta" href="#comisiones">
          Ver reglas
          <span className="home-commissions-rules-notice-cta-arrow" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </section>
  );
}

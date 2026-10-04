"use client";

import { useId, useRef, useState } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";
import { HOME_FAQ_ITEMS } from "@/lib/home-faq-content";

function FaqChevron() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden focusable="false">
      <path
        d="M7 10 L12 15 L17 10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeFaq() {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useSectionScrollReveal(sectionRef);
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      id="preguntas"
      className={sectionScrollRevealClassName("home-faq", reveal)}
      aria-labelledby="home-faq-title"
    >
      <div className="home-faq-inner">
        <h2
          id="home-faq-title"
          className="home-faq-title home-faq-reveal-item home-faq-reveal-item--title"
        >
          Preguntas, respondidas
        </h2>

        <div className="home-faq-list">
          {HOME_FAQ_ITEMS.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `${baseId}-${item.id}-panel`;
            const triggerId = `${baseId}-${item.id}-trigger`;

            return (
              <article
                key={item.id}
                className={`home-faq-item home-faq-reveal-item home-faq-reveal-item--card home-faq-reveal-item--card-${index + 1}${isOpen ? " is-open" : ""}`}
                data-open={isOpen ? "true" : "false"}
              >
                <h3 className="home-faq-item-heading">
                  <button
                    id={triggerId}
                    type="button"
                    className="home-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="home-faq-question">{item.question}</span>
                    <span className="home-faq-chevron">
                      <FaqChevron />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className="home-faq-panel"
                  aria-hidden={!isOpen}
                >
                  <div className="home-faq-panel-inner">
                    <p className="home-faq-answer">{item.answer}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

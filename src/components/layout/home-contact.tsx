"use client";

import { useRef } from "react";
import {
  sectionScrollRevealClassName,
  useSectionScrollReveal,
} from "@/hooks/use-section-scroll-reveal";

export function HomeContact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reveal = useSectionScrollReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className={sectionScrollRevealClassName("home-contact", reveal)}
      aria-labelledby="home-contact-title"
    >
      <div className="home-contact-row">
        <div className="home-contact-copy">
          <h2
            id="home-contact-title"
            className="home-contact-reveal-item home-contact-reveal-item--title"
          >
            ¿Hablamos
            <br />
            <em>de una idea?</em>
          </h2>
          <p
            className="home-contact-subtitle home-contact-reveal-item home-contact-reveal-item--subtitle"
          >
            Ya sea un proyecto, una colaboración o alguna idea interesante, contactame.
          </p>
        </div>
        <a
          className="home-contact-button home-contact-reveal-item home-contact-reveal-item--cta"
          href="mailto:hola@example.com"
        >
          Escribir un mensaje <span>↗</span>
        </a>
      </div>
    </section>
  );
}

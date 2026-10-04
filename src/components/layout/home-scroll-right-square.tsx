"use client";

import { useEffect, useState } from "react";

const HOME_SNS_SECTION_ID = "home-sns";

export function HomeScrollRightSquare() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sns = document.getElementById(HOME_SNS_SECTION_ID);
    if (!sns) return;

    const updateVisibility = () => {
      const { bottom } = sns.getBoundingClientRect();
      setVisible(bottom <= 0);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <div
      className={`home-scroll-right-square${visible ? " home-scroll-right-square--visible" : ""}`}
      aria-hidden={!visible}
    />
  );
}

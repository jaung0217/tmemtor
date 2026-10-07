"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight scroll-reveal wrapper (fade-in + slide-up) used by every
 * one-page section on the Public Website.
 *
 * Deliberately dependency-free — IntersectionObserver + a CSS transition —
 * per task scope ("무거운 애니메이션 라이브러리 새로 설치하지 않는다"). No
 * Framer Motion or similar is introduced. Callers put the section's `id`
 * (anchor target) on the surrounding `<section>`, and wrap the content that
 * should animate in this component.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

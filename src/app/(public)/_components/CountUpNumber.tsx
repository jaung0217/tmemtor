"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates the leading numeric portion of a stat string from 0 up to its
 * target value once the element scrolls into view, e.g. "650+" → counts
 * 0 → 650 then keeps the "+" suffix static; "92%" → 0 → 92 then "%".
 *
 * Dependency-free, same IntersectionObserver pattern as `ScrollReveal`
 * (threshold/rootMargin match it so the count-up starts in sync with that
 * section's reveal), plus `requestAnimationFrame` for the tween. No new
 * npm package.
 */
export function CountUpNumber({
  value,
  duration = 1300,
}: {
  value: string;
  duration?: number;
}) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const targetText = match?.[1] ?? null;
  const suffix = match?.[2] ?? "";
  const target = targetText !== null ? parseFloat(targetText) : null;
  const decimals = targetText?.includes(".")
    ? targetText.split(".")[1].length
    : 0;

  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [display, setDisplay] = useState(() => (0).toFixed(decimals));

  useEffect(() => {
    if (target === null || targetText === null) return;
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const runAnimation = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      if (prefersReducedMotion) {
        // Deferred to a rAF callback (not called synchronously in the
        // effect body) so this stays a "subscribe, setState on callback"
        // pattern rather than a direct effect-body setState.
        requestAnimationFrame(() => setDisplay(targetText));
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        if (progress < 1) {
          setDisplay((target * eased).toFixed(decimals));
          requestAnimationFrame(tick);
        } else {
          setDisplay(targetText); // snap to exact original formatting
        }
      };
      requestAnimationFrame(tick);
    };

    if (prefersReducedMotion) {
      runAnimation();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runAnimation();
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, targetText, duration, decimals]);

  if (target === null) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

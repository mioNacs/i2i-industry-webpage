"use client";

import { useEffect, useState } from "react";

/**
 * Detects scroll direction and whether user has scrolled past a threshold.
 * Used for navbar show/hide and shrink effects.
 */
export function useScrollDirection(threshold = 10) {
  const [scrollDir, setScrollDir] = useState<"up" | "down">("up");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 60);

      if (Math.abs(currentY - lastY) < threshold) return;
      setScrollDir(currentY > lastY ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { scrollDir, isScrolled };
}

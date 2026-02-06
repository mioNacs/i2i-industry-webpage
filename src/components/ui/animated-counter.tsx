"use client";

import { useEffect, useRef, useState } from "react";
import { useIntersection } from "@/hooks/use-intersection";

interface AnimatedCounterProps {
  target: string; // e.g. "1250+" or "85%"
  className?: string;
}

/**
 * Animated counter that counts up when visible in viewport.
 * Parses numbers from strings like "1250+", "85%", "4.5".
 */
export default function AnimatedCounter({
  target,
  className,
}: AnimatedCounterProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.3 });
  const [display, setDisplay] = useState(target);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    // Extract numeric part and suffix
    const match = target.match(/^([\d,.]+)(.*)$/);
    if (!match) {
      setDisplay(target);
      return;
    }

    const numStr = match[1].replace(/,/g, "");
    const suffix = match[2]; // e.g. "+", "%", "K"
    const end = parseFloat(numStr);
    const isFloat = numStr.includes(".");
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * end;

      if (isFloat) {
        setDisplay(current.toFixed(1) + suffix);
      } else {
        setDisplay(Math.floor(current).toLocaleString() + suffix);
      }

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isVisible, target]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

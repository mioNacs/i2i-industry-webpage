"use client";

import { useIntersection } from "@/hooks/use-intersection";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Wrapper that fades-in/slides-up its children when they enter the viewport.
 */
export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  const { ref, isVisible } = useIntersection({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

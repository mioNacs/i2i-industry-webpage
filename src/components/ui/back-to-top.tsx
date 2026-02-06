"use client";

import { useEffect, useState } from "react";
import { LuArrowUp } from "react-icons/lu";
import { cn } from "@/lib/utils";

/**
 * Floating "Back to Top" button that appears after scrolling down.
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-24 right-8 z-40 p-3 rounded-full bg-primary text-white shadow-lg",
        "hover:bg-primary/90 transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <LuArrowUp className="text-xl" />
    </button>
  );
}

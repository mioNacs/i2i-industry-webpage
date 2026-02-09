import { cn } from "@/lib/utils";
import AnimateOnScroll from "./animate-on-scroll";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
}

/**
 * Modern reusable section header with gradient text support.
 * Standardizes typography across all homepage sections with consistent modern Ed-Tech design.
 * 
 * Usage Examples:
 * 1. Simple title with gradient:
 *    <SectionHeader 
 *      title={<>Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Partners</span></>}
 *    />
 * 
 * 2. Multi-line title with subtitle:
 *    <SectionHeader 
 *      title={<>Main Title<br /><span className="text-2xl md:text-4xl text-gray-600 font-semibold">Secondary Line</span></>}
 *      subtitle={<>Description with <span className="font-semibold text-primary">highlighted</span> text</>}
 *    />
 */
export default function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <AnimateOnScroll>
      <div
        className={cn(
          "text-center max-w-4xl mx-auto mb-12",
          align === "left" && "text-left",
          className
        )}
      >
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base md:text-md text-gray-600 leading-relaxed max-w-3xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </AnimateOnScroll>
  );
}

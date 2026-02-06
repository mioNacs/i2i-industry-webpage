import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  className?: string;
  align?: "center" | "left";
}

/**
 * Reusable section header with title, optional subtitle, and accent divider.
 * Standardises typography across all homepage sections.
 */
export default function SectionHeader({
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      <h3 className="text-3xl md:text-4xl font-sans font-black capitalize leading-tight">
        {title}
      </h3>
      <div className="divider divider-accent mx-auto min-w-32 my-0" />
      {subtitle && (
        <p className="text-gray-600 max-w-2xl text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

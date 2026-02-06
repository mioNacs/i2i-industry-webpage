import { getStatsSection } from "@/lib/contentful/client";
import AnimatedCounter from "@/components/ui/animated-counter";

export default async function StatsSection() {
  const response = await getStatsSection();
  const stats = response.data.statsSectionCollection.items;

  return (
    <div className="bg-primary py-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 text-center gap-y-8">
        {stats.map((stat, index) => (
          <div key={index} className="relative group">
            <div className="text-primary-content">
              <AnimatedCounter
                target={stat.value}
                className="text-4xl lg:text-5xl font-bold mb-2 uppercase block"
              />
              <div className="text-sm lg:text-base opacity-90 capitalize">
                {stat.key}
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-primary-content/20" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

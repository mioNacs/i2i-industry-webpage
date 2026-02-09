"use client";

import { JobItem } from "@/lib/contentful/types/job.d";
import { analyzeJobs, formatNumber } from "@/lib/jobAnalytics";
import { useEffect, useState } from "react";
import { LuBriefcase, LuMapPin, LuTrendingUp } from "react-icons/lu";

interface JobInsightsPanelProps {
  jobs: JobItem[];
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = Date.now();
    const duration = 2000;

    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentCount = Math.floor(target * easedProgress);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target]);

  return <span className="font-bold text-primary">{formatNumber(count)}</span>;
}

function InsightCard({
  icon: Icon,
  label,
  value,
  animated = false,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  animated?: boolean;
  delay?: number;
}) {
  const style = {
    animation: `fadeIn 0.6s ease-out ${delay}s both`,
  };

  return (
    <div
      className="group p-4 rounded-lg bg-gradient-to-br from-blue-50 to-transparent border border-blue-100/50 hover:border-blue-200 hover:shadow-sm transition-all duration-300 hover:translate-y-[-2px]"
      style={style}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-900">
        {animated ? <AnimatedCounter target={Number(value)} /> : value}
      </div>
    </div>
  );
}

function PillButton({
  label,
  count,
  isActive = false,
}: {
  label: string;
  count?: number;
  isActive?: boolean;
}) {
  return (
    <button
      className={`group relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 hover:translate-y-[-2px] ${
        isActive
          ? "bg-primary text-white shadow-md"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
      }`}
    >
      <span>{label}</span>
      {count && <span className="ml-1 text-xs opacity-80">({count})</span>}
    </button>
  );
}

export default function JobInsightsPanel({ jobs }: JobInsightsPanelProps) {
  const [analytics, setAnalytics] = useState(analyzeJobs(jobs));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setAnalytics(analyzeJobs(jobs));
    setIsVisible(true);
  }, [jobs]);

  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;

  return (
    <>
      <style>{animationStyles}</style>
      <div
        className={`h-fit transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="space-y-6">
          <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Job Market Insights
            </h3>
            <p className="text-sm text-gray-600">
              Real-time opportunities overview
            </p>
          </div>

          <div className="space-y-3">
            <InsightCard
              icon={LuTrendingUp}
              label="Total Opportunities"
              value={analytics.totalJobs}
              animated={true}
              delay={0}
            />
            <InsightCard
              icon={LuBriefcase}
              label="Active Companies"
              value={Object.keys(analytics.jobsByCompany).length}
              animated={true}
              delay={0.1}
            />
            <InsightCard
              icon={LuMapPin}
              label="Job Locations"
              value={Object.keys(analytics.jobsByLocation).length}
              animated={true}
              delay={0.2}
            />
          </div>

          <div
            className="pt-4 border-t border-gray-200"
            style={{ animation: "slideInLeft 0.6s ease-out 0.3s both" }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Top Hiring Companies
            </h4>
            <div className="space-y-2">
              {analytics.topCompanies.map((company, index) => (
                <div
                  key={company.name}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-default"
                  style={{
                    animation: `slideInLeft 0.4s ease-out ${
                      0.35 + index * 0.08
                    }s both`,
                  }}
                >
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {company.name}
                  </span>
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-primary whitespace-nowrap ml-2 group-hover:bg-blue-200 transition-colors">
                    {company.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="pt-4 border-t border-gray-200"
            style={{ animation: "slideInLeft 0.6s ease-out 0.65s both" }}
          >
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Popular Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {analytics.allLocations.slice(0, 6).map((location, index) => (
                <div
                  key={location.name}
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${0.7 + index * 0.05}s both`,
                  }}
                >
                  <PillButton
                    label={location.name}
                    count={location.count}
                    isActive={
                      location.count === analytics.allLocations[0].count
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div
            className="pt-4 border-t border-gray-200"
            style={{ animation: "fadeInUp 0.6s ease-out 1s both" }}
          >
            <p className="text-xs text-gray-600 text-center mb-3">
              {analytics.totalJobs} positions updated daily
            </p>
            <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-blue-600 text-white text-sm font-semibold hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 active:scale-95">
              Save My Preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

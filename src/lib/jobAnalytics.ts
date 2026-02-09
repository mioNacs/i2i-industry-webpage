import { JobItem } from "@/lib/contentful/types/job.d";

export interface JobAnalytics {
  totalJobs: number;
  jobsByCompany: Record<string, number>;
  jobsByLocation: Record<string, number>;
  topCompanies: Array<{ name: string; count: number }>;
  allLocations: Array<{ name: string; count: number }>;
}

/**
 * Analyze jobs data to extract insights
 */
export function analyzeJobs(jobs: JobItem[]): JobAnalytics {
  const jobsByCompany: Record<string, number> = {};
  const jobsByLocation: Record<string, number> = {};

  jobs.forEach((job) => {
    // Count jobs per company
    jobsByCompany[job.companyName] = (jobsByCompany[job.companyName] || 0) + 1;

    // Count jobs per location
    const location = job.location || "Unknown";
    jobsByLocation[location] = (jobsByLocation[location] || 0) + 1;
  });

  // Get top companies (sorted by count)
  const topCompanies = Object.entries(jobsByCompany)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Get all locations sorted by count
  const allLocations = Object.entries(jobsByLocation)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalJobs: jobs.length,
    jobsByCompany,
    jobsByLocation,
    topCompanies,
    allLocations,
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

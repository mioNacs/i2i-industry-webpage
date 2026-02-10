import JobsPageClient from "@/components/ui/JobsPageClient";
import { getJobsData } from "@/lib/contentful/client";
import JobsHero from "@/components/sections/jobs-hero";

export default async function JobsPage() {
  const jobsResponse = await getJobsData();
  const jobs = jobsResponse.data.jobCollection.items;

  return (
    <div className="w-full min-h-screen font-sans bg-gray-50">
      {/* Hero Section */}
      <JobsHero />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <JobsPageClient jobs={jobs} />
      </div>
    </div>
  );
}

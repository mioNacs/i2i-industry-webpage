import JobsPageClient from "@/components/ui/JobsPageClient";
import { getJobsData } from "@/lib/contentful/client";
import JobsHero from "@/components/sections/jobs-hero";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login-required');
  }

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

import JobsPageClient from "@/components/ui/JobsPageClient";
import { getJobsData } from "@/lib/contentful/client";
import JobsHero from "@/components/sections/jobs-hero";
import { createClient } from "@/lib/supabase/server";
import JobPartners from "@/components/sections/job-partners";

export default async function JobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let jobs: any[] = [];
  let savedJobIds: string[] = [];
  
  // Only fetch jobs if user is logged in
  if (user) {
    const jobsResponse = await getJobsData();
    jobs = jobsResponse.data.jobCollection.items;

    const { data: savedJobs } = await supabase
      .from('saved_jobs')
      .select('job_id')
      .eq('user_id', user.id);
    
    savedJobIds = savedJobs?.map(job => job.job_id) || [];
  }

  return (
    <div className="w-full min-h-screen font-sans bg-gray-50">
      {/* Hero Section - Visible to All */}
      <JobsHero showLoginCard={!user} />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        {user ? (
          <JobsPageClient jobs={jobs} savedJobIds={savedJobIds} />
        ) : (
          <div className="w-full">
            {/* Job Partners Slider - Visible to Non-Logged-In Users */}
            <JobPartners />
          </div>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { getJob } from "@/lib/contentful/client";
import { notFound } from "next/navigation";
import JobDescriptionClient from "@/components/jobs/job-description-client";

export const revalidate = 60; // Revalidate every minute

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  // Check if job is saved
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isSaved = false;
  if (user) {
    const { data } = await supabase
      .from("saved_jobs")
      .select("*")
      .eq("user_id", user.id)
      .eq("job_id", id)
      .single();
    isSaved = !!data;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center py-10 px-4 md:px-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10">
        <JobDescriptionClient job={job} initialIsSaved={isSaved} />
      </div>
    </div>
  );
}

import JobsPageClient from "@/components/ui/JobsPageClient";
import { getJobsData } from "@/lib/contentful/client";
import Link from "next/link";

export default async function JobsPage() {
  const jobsResponse = await getJobsData();
  const jobs = jobsResponse.data.jobCollection.items;

  return (
    <div className="w-full min-h-screen font-sans bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary via-secondary/50 to-blue-50 p-6 md:p-10 lg:p-14 border-b border-gray-200">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-accent/10 via-white to-secondary/30 rounded-2xl border border-accent/20 shadow-sm p-8 md:p-10">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                Careers Hub
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mt-4 mb-4">
                Find Your Next Career <br />
                <span className="text-primary">Within Minutes</span>
              </h1>
              <p className="text-base md:text-lg text-gray-700 max-w-2xl">
                Discover amazing job opportunities from top companies. Apply in seconds and land your dream role.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-12">
        <JobsPageClient jobs={jobs} />
      </div>

      {/* Mobile Courses CTA */}
      <div className="lg:hidden bg-gradient-to-r from-accent/10 to-secondary/50 p-6 mx-4 my-8 rounded-lg border border-accent/20">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">
          📚 Boost Your Skills
        </h3>
        <p className="text-sm text-gray-700 mb-4">
          Check out our professional courses to level up your expertise.
        </p>
        <Link href="/course" className="btn btn-outline btn-sm btn-primary w-full font-semibold">
          Explore Courses
        </Link>
      </div>
    </div>
  );
}

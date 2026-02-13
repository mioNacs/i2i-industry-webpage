"use client";

import { JobItem } from "@/lib/contentful/types/job.d";
import { useEffect, useState } from "react";
import JobCard from "@/components/ui/JobCard";
import { EmptyJobState } from "@/components/ui/EmptyJobState";

const JOBS_PER_PAGE = 10;

interface JobListProps {
  jobs: JobItem[];
  isLoading?: boolean;
  savedJobIds: string[];
}

export default function JobList({ jobs, isLoading = false, savedJobIds }: JobListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [jobs.length]);

  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  if (!isLoading && jobs.length === 0) {
    return <EmptyJobState />;
  }

  return (
    <div className="space-y-6">
      {/* ... existing header ... */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {jobs.length}{" "}
            <span className="text-primary">
              {jobs.length === 1 ? "position" : "positions"}
            </span>{" "}
            available
          </h2>
          {totalPages > 1 && (
            <p className="text-sm text-gray-600 mt-1">
              Showing {startIndex + 1} - {Math.min(endIndex, jobs.length)} of{" "}
              {jobs.length}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {paginatedJobs.map((job, index) => (
          <JobCard
            key={`${job.name}-${startIndex + index}`}
            index={startIndex + index}
            job={job}
            initialIsSaved={savedJobIds.includes(job.sys.id)}
          />
        ))}
      </div>
      
      {/* ... existing footer ... */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-gray-200">
           {/* ... existing footer buttons ... */}
           <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === i + 1
                    ? "bg-primary text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

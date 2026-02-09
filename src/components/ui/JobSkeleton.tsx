"use client";

export function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="flex gap-5">
        <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gray-200"></div>

        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>

          <div className="flex gap-4 pt-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>

          <div className="flex gap-2 pt-2">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>

          <div className="h-9 bg-gray-200 rounded w-32 mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export function JobListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}

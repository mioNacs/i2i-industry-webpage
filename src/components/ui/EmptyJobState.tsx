"use client";

import { LuBriefcase, LuArrowRight } from "react-icons/lu";

export function EmptyJobState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
        <LuBriefcase className="w-8 h-8 text-primary" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>

      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        We couldn't find any jobs matching your filters. Try adjusting your search criteria or come back soon!
      </p>

      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          💡 Tip: Try clearing your filters to see all available positions
        </p>

        <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium transition-all hover:gap-3">
          Browse All Jobs
          <LuArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

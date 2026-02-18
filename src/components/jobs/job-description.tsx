"use client";

import { JobItem } from "@/lib/contentful/types/job.d";
import Image from "next/image";
import { LuBookmark } from "react-icons/lu";
import JobDescriptionSections from "@/components/ui/JobDescriptionSections";

const getTimeAgo = (dateString: string): string => {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = now - date;

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < day) return `${Math.floor(diff / day)}d ago`;
  if (diff < month) return `${Math.floor(diff / day)}d ago`; // Fix for days > 1 but < month logic if needed, simplied here
  if (diff < year) return `${Math.floor(diff / month)}mo ago`;
  return `${Math.floor(diff / year)}y ago`;
};

interface JobDescriptionProps {
  job: JobItem;
  isSaved: boolean;
  onToggleSave: (e?: React.MouseEvent) => void;
  isSaving: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export default function JobDescription({
  job,
  isSaved,
  onToggleSave,
  isSaving,
  onClose,
  showCloseButton = true,
}: JobDescriptionProps) {
  return (
    <div className="bg-white text-start font-sans pb-10">
      <div className="w-full flex flex-col items-start gap-8">
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className="self-end btn btn-sm btn-circle btn-ghost"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {job.companyIcon?.url && (
                    <Image
                    src={job.companyIcon.url}
                    alt={job.companyName}
                    width={56}
                    height={56}
                    className="object-contain w-12 h-12"
                    />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {job.name}
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                  {job.companyName}
                </p>
              </div>
            </div>

            <button
              onClick={onToggleSave}
              disabled={isSaving}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              aria-label={isSaved ? "Unsave job" : "Save job"}
            >
              <LuBookmark
                className={`w-5 h-5 transition-all ${
                  isSaved
                    ? "fill-primary text-primary"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <div className="bg-gradient-to-br from-blue-50 to-transparent p-4 rounded-xl border border-blue-100">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
              Location
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              {job.location}
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-transparent p-4 rounded-xl border border-green-100">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
              Salary
            </p>
            <p className="text-lg font-bold text-primary mt-2">
              {job.salary ? `₹${job.salary}` : "Undisclosed"}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-transparent p-4 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
              Posted
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2">
              {getTimeAgo(job.sys.firstPublishedAt)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-transparent p-4 rounded-xl border border-orange-100">
            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
              Type
            </p>
            <p className="text-lg font-bold text-gray-900 mt-2 capitalize">
              Full-time
            </p>
          </div>
        </div>

        {/* Apply Section */}
        <div className="space-y-3 w-full">
          <h2 className="text-xl font-bold text-gray-900">Apply</h2>
          <div className="bg-gradient-to-br from-blue-50/50 to-transparent border border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 leading-relaxed mb-4">
              Please share your Resume at{" "}
              <a
                href="mailto:info@i2iindustry.com"
                className="text-primary hover:underline font-semibold"
              >
                info@i2iindustry.com
              </a>{" "}
              with the following Details:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Name Of Company</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Name Of Position</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold mt-0.5">•</span>
                <span>Resume</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Overview with Collapsible Sections */}
        <div className="w-full">
          <JobDescriptionSections jobOverview={job.jobOverview} />
        </div>


      </div>
    </div>
  );
}

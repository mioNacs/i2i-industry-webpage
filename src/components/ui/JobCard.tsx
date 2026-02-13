"use client";

import { toggleSaveJob } from "@/app/actions/save-job";
import { JobItem } from "@/lib/contentful/types/job.d";
import Image from "next/image";
import React, { useState } from "react";
import { LuArrowRight, LuBookmark, LuClock, LuMapPin } from "react-icons/lu";
import JobDescriptionSections from "./JobDescriptionSections";

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
  if (diff < month) return `${Math.floor(diff / day)}d ago`;
  if (diff < year) return `${Math.floor(diff / month)}mo ago`;
  return `${Math.floor(diff / year)}y ago`;
};

const jobTypeColors: Record<string, string> = {
  "full-time": "bg-blue-100 text-blue-800",
  "part-time": "bg-green-100 text-green-800",
  internship: "bg-purple-100 text-purple-800",
  contract: "bg-orange-100 text-orange-800",
  remote: "bg-cyan-100 text-cyan-800",
  freelance: "bg-amber-100 text-amber-800",
};

export default function JobCard({
  job,
  index,
  initialIsSaved,
}: {
  job: JobItem;
  index: number;
  initialIsSaved: boolean;
}) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);
  const drawerId = `jd-drawer-${index}`;

  const toggleDrawer = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const drawer = document.getElementById(drawerId) as HTMLInputElement | null;
    if (drawer) {
      drawer.checked = !drawer.checked;
    }
  };

  const toggleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isSaving) return;

    // Optimistic update
    setIsSaved((prev) => !prev);
    setIsSaving(true);

    try {
      const result = await toggleSaveJob(job.sys.id, isSaved);
      if (!result.success) {
        // Revert if failed
        setIsSaved((prev) => !prev);
        console.error(result.error);
        alert("Failed to save job. Please try again.");
      }
    } catch (error) {
      setIsSaved((prev) => !prev);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const jobTypes = ["full-time"];

  return (
    <div className="drawer drawer-end">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <div
          className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 hover:translate-y-[-2px]"
        >
          <div className="flex gap-5">
            {/* Company Logo */}
            <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center">
              <Image
                src={job.companyIcon.url}
                alt={job.companyName}
                width={60}
                height={60}
                className="object-contain w-12 h-12"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Job Title */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors truncate">
                    {job.name}
                  </h3>
                  {/* Company Name */}
                  <p className="text-sm text-gray-600 mt-1">
                    {job.companyName}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                    {/* Location */}
                    <div className="flex items-center gap-1">
                      <LuMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    {/* Salary */}
                    {job.salary && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-primary">
                          ₹{job.salary}
                        </span>
                      </div>
                    )}
                    {/* Posted Time */}
                    <div className="flex items-center gap-1">
                      <LuClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{getTimeAgo(job.sys.firstPublishedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {jobTypes.map((type) => (
                      <span
                        key={type}
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          jobTypeColors[type] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                 {/* Save Button */}
                <button
                  onClick={(e) => toggleSave(e)}
                  disabled={isSaving}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
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

              {/* Apply Button */}
              <button
                onClick={(e) => toggleDrawer(e)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-all hover:gap-3"
              >
                View Details
                <LuArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Content */}
      <div className="drawer-side z-10">
        <label htmlFor={drawerId} className="drawer-overlay"></label>
        <div className="bg-white text-base-content min-h-full w-full md:w-[80%] lg:w-[60%] py-6 px-4 md:px-10 overflow-y-auto">
          <JobDescription 
            job={job} 
            id={drawerId} 
            isSaved={isSaved} 
            onToggleSave={toggleSave} 
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
}

function JobDescription({
  job,
  id,
  isSaved,
  onToggleSave,
  isSaving
}: {
  job: JobItem;
  id: string;
  isSaved: boolean;
  onToggleSave: () => void;
  isSaving: boolean;
}) {
  const closeDrawer = () => {
    const drawer = document.getElementById(id) as HTMLInputElement | null;
    if (drawer) {
      drawer.checked = false;
    }
  };

  return (
    <div className="bg-white text-start font-sans pb-10">
      <div className="w-full flex flex-col items-start gap-8">
        {/* Close Button */}
        <button
          onClick={closeDrawer}
          className="self-end btn btn-sm btn-circle btn-ghost"
        >
          ✕
        </button>

        {/* Header */}
        <div className="w-full">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-lg bg-gray-100 flex items-center justify-center">
                <Image
                  src={job.companyIcon.url}
                  alt={job.companyName}
                  width={56}
                  height={56}
                  className="object-contain w-12 h-12"
                />
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
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Save job"
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

        {/* What we're looking for */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">
            What we&apos;re looking for
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Strong problem-solving skills and attention to detail.</li>
            <li>Experience working with cross-functional teams.</li>
            <li>Ability to communicate complex ideas clearly.</li>
          </ul>
        </div>

        {/* What we offer */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">What we offer</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Flexible working hours and hybrid-friendly culture.</li>
            <li>Health insurance, learning budget, and wellness perks.</li>
            <li>Collaborative team with growth opportunities.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import JobList from "@/components/ui/JobList";
import JobSearch from "@/components/ui/JobSearch";
import { JobItem } from "@/lib/contentful/types/job.d";
import Link from "next/link";

interface JobsPageClientProps {
  jobs: JobItem[];
}

function parseSalaryValue(salary: string | null): number | null {
  if (!salary) return null;
  const numbers = salary.match(/\d+(?:\.\d+)?/g);
  if (!numbers || numbers.length === 0) return null;
  return Number(numbers[0]);
}

function matchesSalaryRange(salaryValue: number | null, range: string): boolean {
  if (!range) return true;
  if (salaryValue === null) return false;

  if (range.includes("+")) {
    const min = Number(range.match(/\d+/)?.[0] ?? 0);
    return salaryValue >= min;
  }

  const parts = range.match(/\d+(?:\.\d+)?/g);
  if (!parts || parts.length < 2) return true;
  const [min, max] = parts.map(Number);
  return salaryValue >= min && salaryValue <= max;
}

export default function JobsPageClient({ jobs }: JobsPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const location = locationFilter.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesQuery =
        !query ||
        job.name.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query) ||
        job.jobOverview.toLowerCase().includes(query);

      const matchesLocation =
        !location || job.location.toLowerCase() === location;

      const salaryValue = parseSalaryValue(job.salary);
      const matchesSalary = matchesSalaryRange(salaryValue, salaryFilter);

      return matchesQuery && matchesLocation && matchesSalary;
    });
  }, [jobs, searchQuery, locationFilter, salaryFilter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="space-y-8 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              ⚙️ Filter Jobs
            </h2>
            <JobSearch
              onSearch={setSearchQuery}
              onLocationFilter={setLocationFilter}
              onSalaryFilter={setSalaryFilter}
              locations={locations}
            />
          </div>

          <div className="bg-gradient-to-br from-accent/10 via-white to-secondary/30 p-6 rounded-xl shadow-sm border border-accent/20">
            <h3 className="font-semibold text-gray-900 text-lg mb-3">
              📚 Boost Your Skills
            </h3>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              Our professionally curated courses will help you land your dream job faster.
            </p>
            <Link
              href="/course"
              className="btn btn-outline btn-sm btn-primary w-full font-semibold"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <JobList jobs={filteredJobs} />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import JobDescription from "./job-description";
import { JobItem } from "@/lib/contentful/types/job.d";
import { toggleSaveJob } from "@/app/actions/save-job";

interface Props {
  job: JobItem;
  initialIsSaved: boolean;
}

export default function JobDescriptionClient({ job, initialIsSaved }: Props) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <JobDescription
      job={job}
      isSaved={isSaved}
      onToggleSave={toggleSave}
      isSaving={isSaving}
      showCloseButton={false}
    />
  );
}

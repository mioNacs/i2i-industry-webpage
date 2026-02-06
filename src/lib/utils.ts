import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: (string | undefined | false | null)[]) {
  return twMerge(inputs.filter(Boolean).join(" "));
}

/** Format a date string to a readable format */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Get relative time ago string from a date */
export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString).getTime();
  const now = new Date().getTime();
  const diff = now - date;

  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)} minutes ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hours ago`;
  if (diff < month) return `${Math.floor(diff / day)} days ago`;
  if (diff < year) return `${Math.floor(diff / month)} months ago`;
  return `${Math.floor(diff / year)} years ago`;
}

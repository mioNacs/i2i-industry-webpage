"use client";

import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

interface Section {
  title: string;
  content: string;
}

// Parse job description into sections based on __title__ or __title : markers
function parseJobDescription(text: string): Section[] {
  const sections: Section[] = [];
  // Match both __text__ and __text : patterns
  const regex = /__([\w\s\-/&,\.]+?)\s*(?:__|:(?:\s|$))/g;

  let lastIndex = 0;
  let match;
  const matches = Array.from(text.matchAll(regex));

  matches.forEach((m, idx) => {
    const title = m[1].trim();
    const startIndex = m.index! + m[0].length;
    
    // Get content until next section or end of text
    const nextMatch = matches[idx + 1];
    const endIndex = nextMatch ? nextMatch.index : text.length;
    const content = text.substring(startIndex, endIndex).trim();

    if (content && title) {
      sections.push({ title, content });
    }
  });

  return sections;
}

// Format content with better line breaks and lists
function formatContent(content: string): React.ReactNode {
  // Split by newlines and filter empty lines
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        // Check if line starts with a bullet or number pattern
        if (line.match(/^[•\-\*]\s/) || line.match(/^\d+\.\s/)) {
          return (
            <div key={idx} className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="text-primary font-bold flex-shrink-0">•</span>
              <span>{line.replace(/^[•\-\*\d\.]\s+/, "")}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

interface JobDescriptionSectionsProps {
  jobOverview: string;
}

export default function JobDescriptionSections({
  jobOverview,
}: JobDescriptionSectionsProps) {
  const sections = parseJobDescription(jobOverview);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (sections.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">About this role</h2>
        <p className="text-gray-700 leading-relaxed">{jobOverview}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => (
        <div
          key={idx}
          className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            className={`w-full flex items-center justify-between px-5 py-4 font-semibold text-lg transition-all ${
              idx === 0
                ? "bg-gradient-to-r from-primary/5 to-accent/5 text-gray-900 cursor-default"
                : "bg-gray-50 hover:bg-gray-100 text-gray-800"
            }`}
            disabled={idx === 0}
          >
            <span className="text-start">{section.title}</span>
            {idx !== 0 && (
              <HiChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                  expandedIndex === idx ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* Content - always visible for first section, collapsible for others */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              idx === 0 || expandedIndex === idx
                ? "max-h-[1000px] border-t border-gray-200"
                : "max-h-0"
            }`}
          >
            <div className="px-5 py-4 text-gray-700">
              {formatContent(section.content)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

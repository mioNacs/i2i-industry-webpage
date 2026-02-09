"use client";

import { useState } from "react";
import {
  LuMapPin,
  LuDollarSign,
  LuSearch,
  LuX,
  LuChevronDown,
} from "react-icons/lu";

interface JobSearchProps {
  onSearch: (query: string) => void;
  onLocationFilter: (location: string) => void;
  onSalaryFilter: (range: string) => void;
  locations: string[];
}

export default function JobSearch({
  onSearch,
  onLocationFilter,
  onSalaryFilter,
  locations,
}: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSalaryDropdown, setShowSalaryDropdown] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    onLocationFilter(location);
    setShowLocationDropdown(false);
  };

  const handleSalaryChange = (range: string) => {
    setSelectedSalary(range);
    onSalaryFilter(range);
    setShowSalaryDropdown(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedSalary("");
    onSearch("");
    onLocationFilter("");
    onSalaryFilter("");
  };

  const hasActiveFilters = searchQuery || selectedLocation || selectedSalary;

  const salaryRanges = [
    "0 - 5 LPA",
    "5 - 10 LPA",
    "10 - 15 LPA",
    "15 - 20 LPA",
    "20+ LPA",
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search jobs by title, skill, or company..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setShowLocationDropdown(!showLocationDropdown);
                setShowSalaryDropdown(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <LuMapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {selectedLocation || "All Locations"}
                </span>
              </div>
              <LuChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showLocationDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showLocationDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleLocationChange("")}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors ${
                      !selectedLocation ? "bg-blue-50 text-primary" : ""
                    }`}
                  >
                    All Locations
                  </button>
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationChange(location)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors ${
                        selectedLocation === location
                          ? "bg-blue-50 text-primary"
                          : ""
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowSalaryDropdown(!showSalaryDropdown);
                setShowLocationDropdown(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <LuDollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {selectedSalary || "All Salaries"}
                </span>
              </div>
              <LuChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showSalaryDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {showSalaryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleSalaryChange("")}
                    className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors ${
                      !selectedSalary ? "bg-blue-50 text-primary" : ""
                    }`}
                  >
                    All Salaries
                  </button>
                  {salaryRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => handleSalaryChange(range)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm transition-colors ${
                        selectedSalary === range
                          ? "bg-blue-50 text-primary"
                          : ""
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-red-200"
          >
            <LuX className="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

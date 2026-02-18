"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { LuMail, LuPhone, LuMapPin } from "react-icons/lu";
import { BsChevronRight } from "react-icons/bs";
import { socialLinks } from "@/lib/constants";
import Logo from "../../../public/logo.png";

import { CourseItem } from "@/lib/contentful/types/courses";

type Course = CourseItem;

type AddressEntry = {
  label: string;
  mapQuery: string;
  mapUrl?: string;
};

type FooterClientProps = {
  email?: string;
  phone?: string;
  courses: Course[];
  addresses: unknown;
};

const resources = [
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "About Us", href: "/about" },
];

const labelKeys = ["address", "label", "value", "name", "location", "title"];
const mapQueryKeys = ["mapQuery", "map", "query", ...labelKeys];
const mapUrlKeys = ["mapUrl", "mapURL", "googleMapUrl", "googleMap", "url", "link"];

function pickString(obj: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function buildAddressEntry(value: unknown): AddressEntry | null {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    return { label: trimmed, mapQuery: trimmed };
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const label = pickString(obj, labelKeys);
    const mapQuery = pickString(obj, mapQueryKeys) ?? label;
    const mapUrl = pickString(obj, mapUrlKeys);

    if (!mapQuery && !mapUrl) {
      return null;
    }

    return {
      label: label ?? mapQuery ?? "Location",
      mapQuery: mapQuery ?? label ?? "",
      mapUrl,
    };
  }

  return null;
}

function normalizeAddresses(raw: unknown): AddressEntry[] {
  const entries: AddressEntry[] = [];

  const addEntry = (value: unknown) => {
    const entry = buildAddressEntry(value);
    if (entry && (entry.mapQuery || entry.mapUrl)) {
      entries.push(entry);
    }
  };

  if (Array.isArray(raw)) {
    raw.forEach(addEntry);
  } else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    
    // Check if it's a structured object with "items" array
    if (Array.isArray(obj.items)) {
      obj.items.forEach(addEntry);
    } 
    // Check if it has typical address properties
    else if (labelKeys.some(key => typeof obj[key] === "string") || 
             mapQueryKeys.some(key => typeof obj[key] === "string") ||
             mapUrlKeys.some(key => typeof obj[key] === "string")) {
      addEntry(raw);
    }
    // Otherwise, treat it as a plain object with arbitrary keys (like {a: "...", b: "..."})
    else {
      Object.values(obj).forEach(addEntry);
    }
  } else if (typeof raw === "string") {
    addEntry(raw);
  }

  return entries;
}

export default function FooterClient({
  email,
  phone,
  courses,
  addresses,
}: FooterClientProps) {
  const normalizedAddresses = useMemo(
    () => normalizeAddresses(addresses),
    [addresses]
  );

  console.log("Normalized Addresses:", normalizedAddresses);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeAddress = normalizedAddresses[activeIndex];

  const mapSrc = activeAddress?.mapUrl
    ? activeAddress.mapUrl
    : `https://maps.google.com/maps?q=${encodeURIComponent(
        activeAddress?.mapQuery ?? ""
      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <footer className="font-sans w-full px-4 sm:px-8 lg:px-16 flex flex-col pt-8 bg-gray-100 text-secondary-content/80">
      <div className="footer">
        {/* Logo Section */}
        <aside className="space-y-4">
          <Image
            className="w-[280px] h-[85px] object-cover border border-accent/30 rounded-lg"
            alt="i2i Industry logo"
            src={Logo}
            width={300}
            height={85}
          />
          <p className="text-sm ml-3 max-w-[350px]">
            Our platform offers a hands-on approach to learning via live
            classes, 2-step counselling, and 100% placement assistance.
          </p>
          <div className="flex gap-6 mt-6 ml-3">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="text-gray-800 hover:text-primary transition-colors"
                >
                  <Icon className="h-6 w-6" />
                </Link>
              );
            })}
          </div>
        </aside>

        <div></div>

        {/* Stay in Touch */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">
            Stay in touch
          </h3>
          <div className="space-y-5">
            {email ? (
              <div className="flex items-center gap-2">
                <LuMail className="text-lg flex-shrink-0" />
                <a
                  href={`mailto:${email}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {email}
                </a>
              </div>
            ) : null}

            {phone ? (
              <div className="flex items-center gap-2">
                <LuPhone className="text-lg flex-shrink-0" />
                <a
                  href={`tel:${phone}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {phone}
                </a>
              </div>
            ) : null}

            {normalizedAddresses.length ? (
              <div className="flex flex-col gap-2 max-w-[280px]">
                {normalizedAddresses.map((entry, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={`${entry.label}-${index}`}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-pressed={isActive}
                      className={`flex items-start gap-2 text-left transition-colors ${
                        isActive
                          ? "text-primary font-semibold"
                          : "text-gray-700 hover:text-primary"
                        }`}
                    >
                      <LuMapPin className="mt-0.5 flex-shrink-0" />
                      <span>{entry.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </nav>

        {/* Courses */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">Courses</h3>
          <ul className="space-y-5 max-w-[280px]">
            {courses.slice(0, 3).map((course) => (
              <li key={course.title}>
                <Link
                  href={`/course/${course.sys.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {course.title}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/course/"
                className="hover:underline transition-colors text-primary flex items-center gap-2"
              >
                View All Courses <BsChevronRight />
              </Link>
            </li>
          </ul>
        </nav>

        {/* Resources */}
        <nav className="text-base">
          <h3 className="text-xl font-semibold mb-2 capitalize">Resources</h3>
          <ul className="space-y-5">
            {resources.map((resource) => (
              <li key={resource.name}>
                <Link
                  href={resource.href}
                  className="hover:text-primary transition-colors"
                >
                  {resource.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Map Section */}
      {activeAddress ? (
        <div className="mt-12">
          <div className="w-full h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg">
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
              className="grayscale-[30%] hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <p className="text-center mt-4 text-sm text-gray-600">
            📍 {activeAddress.label}
          </p>
        </div>
      ) : null}

      <div className="p-6 text-base-content text-sm flex justify-center mt-16 pt-8 border-t border-gray-500/20">
        {`Copyright ©${new Date().getFullYear()} i2i Industry. All Rights Reserved.`}
      </div>
    </footer>
  );
}

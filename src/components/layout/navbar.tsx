"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { LuMail, LuPhone, LuMenu, LuX } from "react-icons/lu";
import { getContact, getCourses } from "@/lib/contentful/client";
import { ContactUsButton } from "@/components/forms/contact-form";
import UserNav from "./user-nav";
import { socialLinks, NAV_LINKS } from "@/lib/constants";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import type { ContactItem } from "@/lib/contentful/types/contact";
import Logo from "../../../public/logo.png";

type CourseLink = { label: string; path: string };
const VIEW_ALL_LABEL = "All Courses";

export default function NavBar() {
  const [courses, setCourses] = useState<CourseLink[]>([]);
  const [contact, setContact] = useState<ContactItem>({
    address: "",
    email: "",
    phoneNumber: "",
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [mobileCourseOpen, setMobileCourseOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isScrolled } = useScrollDirection();
  const courseBtnRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  // Prevent transitions on initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (coursesDropdownOpen) {
        setCoursesDropdownOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [coursesDropdownOpen]);

  useEffect(() => {
    Promise.all([getCourses(), getContact()]).then(
      ([coursesRes, contactRes]) => {
        const items = coursesRes.data.coursesCollection.items
          .slice(0, 5)
          .map((e: any) => ({ label: e.name, path: `/course/${e.sys.id}` }));
        items.push({ label: VIEW_ALL_LABEL, path: "/course" });
        setCourses(items);
        setContact(contactRes.data.contactCollection.items[0]);
      }
    );
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileCourseOpen(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!coursesDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (courseBtnRef.current?.contains(e.target as Node)) return;
      setCoursesDropdownOpen(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [coursesDropdownOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      {/* ── Top info bar (desktop only) ────────────────────────── */}
      <div
        className={cn(
          "hidden lg:flex justify-between py-2 bg-gray-800 font-sans text-[15px] text-white font-medium px-20 transition-all duration-300",
          isScrolled && "h-0 py-0 overflow-hidden opacity-0"
        )}
      >
        <div className="flex gap-6">
          {contact.phoneNumber && (
            <a
              href={`tel:${contact.phoneNumber}`}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <LuPhone className="text-sm" />
              {contact.phoneNumber}
            </a>
          )}
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <LuMail className="text-sm" />
              {contact.email}
            </a>
          )}
        </div>
        <div className="flex gap-6 items-center">
          <p>Follow Us:</p>
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                aria-label={social.label}
                className="hover:text-accent transition-colors"
              >
                <Icon className="size-5" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main navbar — glassmorphism ─────────────────────────── */}
      <nav
        className={cn(
          "w-full flex items-center justify-between px-6 lg:px-16 transition-all duration-300 border-b",
          isScrolled
            ? "h-20 bg-white/60 backdrop-blur-xl shadow-md border-black"
            : "h-20 bg-white/95 backdrop-blur-sm border-gray-200"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            className={cn(
              "object-cover transition-all duration-300",
              isScrolled ? "w-[140px] h-[48px]" : "w-[186px] h-[62px]"
            )}
            alt="i2i Industry Logo"
            src={Logo}
            width={186}
            height={62}
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden sm:flex items-center gap-8 font-sans h-full">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="hover:text-primary font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Courses Dropdown */}
          <li className="relative">
            <button
              ref={courseBtnRef}
              className="flex items-center gap-2 font-medium hover:text-primary transition-colors"
              onClick={() => {
                if (courseBtnRef.current) {
                  const rect = courseBtnRef.current.getBoundingClientRect();
                  setDropdownPos({ top: rect.bottom + 8, left: rect.left });
                }
                setCoursesDropdownOpen(!coursesDropdownOpen);
              }}
            >
              Courses
              <FaChevronDown
                className={cn(
                  "size-3 transition-transform duration-200",
                  coursesDropdownOpen && "rotate-180"
                )}
              />
            </button>
          </li>
        </ul>

        {/* Desktop CTA */}
        <div className="hidden sm:flex items-center">
          <UserNav />
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <LuX className="text-2xl text-accent" />
          ) : (
            <LuMenu className="text-2xl text-accent" />
          )}
        </button>
      </nav>

      {/* ── Courses Dropdown (outside nav so backdrop-blur works) ── */}
      <div
        className={cn(
          "fixed w-96 bg-white/50 backdrop-blur-xl rounded-xl shadow-2xl border-2 border-black overflow-hidden z-[60] transition-all duration-300",
          coursesDropdownOpen
            ? "opacity-100 scale-100 pointer-events-auto transition-opacity duration-300"
            : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ top: dropdownPos.top, left: dropdownPos.left }}
      >
        {courses.map((course, i) => (
          <Link
            key={i}
            href={course.path}
            onClick={() => setCoursesDropdownOpen(false)}
            className="group flex items-center p-3 hover:bg-accent/5 transition-colors"
          >
            {course.label === VIEW_ALL_LABEL ? (
              <span className="flex-1 py-1 text-primary font-medium flex items-center justify-between">
                {course.label}
                <FaChevronRight className="text-xs" />
              </span>
            ) : (
              <span className="flex-1 py-1 text-gray-700 font-medium group-hover:text-primary transition-colors">
                {course.label}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── Mobile Menu (slide-in overlay) ─────────────────────── */}
      <div
        className={cn(
          "fixed inset-0 top-16 bg-white z-40 flex flex-col items-center gap-6 py-8 font-sans transition-all duration-300 sm:hidden overflow-y-auto",
          mobileOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className="text-lg font-medium hover:text-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}

        {/* Mobile Course Accordion */}
        <div className="w-full px-8">
          <button
            className="flex items-center justify-center gap-2 w-full text-lg font-medium"
            onClick={() => setMobileCourseOpen(!mobileCourseOpen)}
          >
            Courses
            <FaChevronDown
              className={cn(
                "size-3 transition-transform duration-200",
                mobileCourseOpen && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "mt-3 flex flex-col gap-2 bg-accent/5 rounded-lg p-4 overflow-hidden transition-all duration-300",
              mobileCourseOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 p-0"
            )}
          >
            {courses.map((course, i) => (
              <Link
                key={i}
                href={course.path}
                onClick={closeMobile}
                className={cn(
                  "py-2 px-2 rounded text-sm font-medium transition-colors",
                  course.label === VIEW_ALL_LABEL
                    ? "text-primary underline underline-offset-4"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {course.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4 w-full">
          <UserNav />
        </div>
      </div>
    </header>
  );
}

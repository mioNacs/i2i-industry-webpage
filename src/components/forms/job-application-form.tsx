"use client";

import { ChangeEvent, FormEvent, useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { twMerge } from "tailwind-merge";
import { FORMSPREE_ENDPOINT } from "@/lib/constants";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface JobApplicationFormData {
    applicantName: string;
    email: string;
    phone: string;
    jobTitle: string;
    company: string;
    currentLocation: string;
    experience: string;
    resumeLink: string;
    coverNote: string;
    // Education
    educationLevel: string;
    collegeName: string;
    passingYear: string;
    // Skills (stored as array, serialised to CSV for Formspree)
    skills: string[];
    skillInput: string; // transient – not sent to Formspree
}

interface FormErrors {
    applicantName?: string;
    email?: string;
    phone?: string;
    currentLocation?: string;
    experience?: string;
    submit?: string;
}

const EXPERIENCE_OPTIONS = [
    "Student / Intern",
    "Fresher / 0 years",
    "1 year",
    "1–2 years",
    "2–3 years",
    "3–5 years",
    "5–8 years",
    "8+ years",
] as const;

const EDUCATION_LEVEL_OPTIONS = [
    "High School / 10th",
    "Intermediate / 12th",
    "Diploma",
    "B.Tech / B.E.",
    "B.Sc",
    "B.Com",
    "B.A.",
    "BCA",
    "BBA",
    "M.Tech / M.E.",
    "M.Sc",
    "MBA",
    "MCA",
    "Ph.D",
    "Other",
] as const;


const EMPTY_FORM: JobApplicationFormData = {
    applicantName: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    currentLocation: "",
    experience: "Fresher / 0 years",
    resumeLink: "",
    coverNote: "",
    educationLevel: "",
    collegeName: "",
    passingYear: "",
    skills: [],
    skillInput: "",
};

// ─── Validation ─────────────────────────────────────────────────────────────

function validateApplicationForm(data: JobApplicationFormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.applicantName.trim()) errors.applicantName = "Full name is required";
    if (!data.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
        errors.email = "Please enter a valid email address";
    if (!data.phone) errors.phone = "Phone number is required";
    else if (data.phone.length < 6) errors.phone = "Phone number is too short";
    if (!data.currentLocation.trim())
        errors.currentLocation = "Current location is required";
    if (!data.experience) errors.experience = "Please select your experience";
    return errors;
}

// ─── FormField helper ────────────────────────────────────────────────────────

function FormField({
    label,
    error,
    required = true,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col w-full gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
            </label>
            {children}
            {error && (
                <p className="text-error text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── Custom searchable dropdown ──────────────────────────────────────────────

function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    showSearch = true,
}: {
    value: string;
    onChange: (value: string) => void;
    options: readonly string[];
    placeholder?: string;
    showSearch?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const filtered = showSearch
        ? options.filter((o) => o.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            if (showSearch) setTimeout(() => searchInputRef.current?.focus(), 50);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, showSearch]);

    const handleSelect = (opt: string) => {
        onChange(opt);
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div ref={dropdownRef} className="relative w-full">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                className={twMerge(
                    "input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm text-left flex items-center justify-between",
                    !value && "text-gray-400"
                )}
            >
                <span className="truncate">{value || placeholder}</span>
                <svg
                    className={twMerge("w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2", isOpen && "rotate-180")}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 left-0">
                    {showSearch && (
                        <div className="p-3 border-b border-gray-100">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                />
                            </div>
                        </div>
                    )}
                    <div className="max-h-56 overflow-y-auto py-1">
                        {filtered.length > 0 ? (
                            filtered.map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleSelect(opt)}
                                    className={twMerge(
                                        "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-accent/5 flex items-center justify-between",
                                        value === opt && "bg-accent/10 text-accent font-medium"
                                    )}
                                >
                                    <span className="truncate pr-2">{opt}</span>
                                    {value === opt && (
                                        <svg className="w-4 h-4 text-accent flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-center text-sm text-gray-400">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface JobApplicationButtonProps {
    jobTitle: string;
    companyName: string;
    className?: string;
}

export function JobApplicationButton({
    jobTitle,
    companyName,
    className,
}: JobApplicationButtonProps) {
    const MODAL_ID = "job_application_modal";
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [formData, setFormData] = useState<JobApplicationFormData>({
        ...EMPTY_FORM,
        jobTitle,
        company: companyName,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Keep jobTitle/company in sync if the prop changes (user selects a different job)
    useEffect(() => {
        setFormData((prev) => ({ ...prev, jobTitle, company: companyName }));
    }, [jobTitle, companyName]);

    const openModal = () => {
        setErrors({});
        setSubmitted(false);
        setIsClosing(false);
        dialogRef.current?.showModal();
    };

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            dialogRef.current?.close();
            setIsClosing(false);
        }, 200);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 15);
        setFormData((prev) => ({ ...prev, phone: value }));
        if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
    };

    // ── Skills tag helpers ────────────────────────────────────────────
    const addSkill = (raw: string) => {
        const tag = raw.trim().replace(/,+$/, "").trim();
        if (tag && !formData.skills.includes(tag)) {
            setFormData((prev) => ({ ...prev, skills: [...prev.skills, tag], skillInput: "" }));
        } else {
            setFormData((prev) => ({ ...prev, skillInput: "" }));
        }
    };

    const handleSkillInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        // If user typed a comma, treat the text before it as a tag
        if (val.endsWith(",")) {
            addSkill(val.slice(0, -1));
        } else {
            setFormData((prev) => ({ ...prev, skillInput: val }));
        }
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill(formData.skillInput);
        } else if (e.key === "Backspace" && !formData.skillInput && formData.skills.length > 0) {
            setFormData((prev) => ({ ...prev, skills: prev.skills.slice(0, -1) }));
        }
    };

    const removeSkill = (tag: string) => {
        setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== tag) }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validateApplicationForm(formData);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        setIsSubmitting(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { skillInput, skills, ...rest } = formData;
            const payload = {
                ...rest,
                skills: skills.length > 0 ? skills.join(", ") : "—",
                _subject: `Job Application – ${formData.jobTitle} at ${formData.company}`,
            };

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmitted(true);
                toast.success("Application submitted! We'll be in touch soon.");
            } else {
                throw new Error("Submission failed");
            }
        } catch {
            setErrors((prev) => ({
                ...prev,
                submit: "Failed to submit application. Please try again.",
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={openModal}
                className={twMerge(
                    "btn btn-accent rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 transition-all duration-200",
                    className
                )}
            >
                Apply Now
            </button>

            {/* Modal */}
            <dialog
                ref={dialogRef}
                id={MODAL_ID}
                className="modal font-sans backdrop-blur-sm"
            >
                <div
                    className={twMerge(
                        "modal-box max-w-2xl bg-gradient-to-br from-white to-gray-50 flex flex-col no-scrollbar items-stretch gap-6 transition-all duration-300 shadow-2xl border border-gray-100 rounded-2xl p-8",
                        isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between pb-4 border-b border-gray-200">
                        <div>
                            <h3 className="font-bold text-2xl text-black/80 underline decoration-4 decoration-accent">
                                Job Application
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Applying for{" "}
                                <span className="font-semibold text-gray-700">{jobTitle}</span>
                                {companyName && (
                                    <>
                                        {" "}at{" "}
                                        <span className="font-semibold text-gray-700">
                                            {companyName}
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={closeModal}
                            type="button"
                            className="btn btn-circle btn-ghost btn-sm hover:bg-gray-100 hover:rotate-90 transition-all duration-300"
                            aria-label="Close"
                        >
                            <CgClose className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Success State */}
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h4 className="text-xl font-bold text-gray-800">
                                Application Submitted!
                            </h4>
                            <p className="text-gray-500 max-w-sm">
                                Thank you for applying. Our team will review your application
                                and get back to you shortly.
                            </p>
                            <button
                                onClick={closeModal}
                                className="btn btn-accent mt-2 rounded-xl px-8"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        /* Form */
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col w-full gap-5"
                        >
                            {/* Read-only job info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Position">
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        readOnly
                                        className="input input-bordered bg-gray-50 text-gray-700 font-medium text-sm"
                                    />
                                </FormField>
                                <FormField label="Company">
                                    <input
                                        type="text"
                                        value={companyName}
                                        readOnly
                                        className="input input-bordered bg-gray-50 text-gray-700 font-medium text-sm"
                                    />
                                </FormField>
                            </div>

                            {/* Applicant details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Full Name" error={errors.applicantName}>
                                    <input
                                        type="text"
                                        name="applicantName"
                                        placeholder="Your full name"
                                        value={formData.applicantName}
                                        onChange={handleChange}
                                        className={twMerge(
                                            "input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm",
                                            errors.applicantName && "input-error"
                                        )}
                                    />
                                </FormField>

                                <FormField label="Email Address" error={errors.email}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        spellCheck={false}
                                        className={twMerge(
                                            "input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm",
                                            errors.email && "input-error"
                                        )}
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Phone Number" error={errors.phone}>
                                    <input
                                        type="tel"
                                        name="phone"
                                        inputMode="tel"
                                        placeholder="Mobile number"
                                        value={formData.phone}
                                        onChange={handlePhoneChange}
                                        className={twMerge(
                                            "input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm",
                                            errors.phone && "input-error"
                                        )}
                                    />
                                </FormField>

                                <FormField label="Current Location" error={errors.currentLocation}>
                                    <input
                                        type="text"
                                        name="currentLocation"
                                        placeholder="City, State"
                                        value={formData.currentLocation}
                                        onChange={handleChange}
                                        className={twMerge(
                                            "input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm",
                                            errors.currentLocation && "input-error"
                                        )}
                                    />
                                </FormField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormField label="Work Experience" error={errors.experience}>
                                    <CustomSelect
                                        value={formData.experience}
                                        onChange={(val) => {
                                            setFormData((prev) => ({ ...prev, experience: val }));
                                            if (errors.experience) setErrors((prev) => ({ ...prev, experience: "" }));
                                        }}
                                        options={EXPERIENCE_OPTIONS}
                                        placeholder="Select experience…"
                                        showSearch={false}
                                    />
                                </FormField>

                                <FormField label="Resume / Portfolio Link" required={false}>
                                    <input
                                        type="url"
                                        name="resumeLink"
                                        placeholder="https://drive.google.com/…"
                                        value={formData.resumeLink}
                                        onChange={handleChange}
                                        className="input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm"
                                    />
                                </FormField>
                            </div>

                            {/* ── Education ───────────────────────────────────────────── */}
                            <div className="divider text-xs text-gray-400 font-semibold uppercase tracking-wider my-0">Education</div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <FormField label="Highest Education" required={true}>
                                    <CustomSelect
                                        value={formData.educationLevel}
                                        onChange={(val) => setFormData((prev) => ({ ...prev, educationLevel: val }))}
                                        options={EDUCATION_LEVEL_OPTIONS}
                                        placeholder="Select level…"
                                        showSearch={false}
                                    />
                                </FormField>

                                <FormField label="College / Institution" required={true}>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        placeholder="College or university name"
                                        value={formData.collegeName}
                                        onChange={handleChange}
                                        className="input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm"
                                    />
                                </FormField>

                                <FormField label="Passing Year" required={true}>
                                    <input
                                        type="text"
                                        name="passingYear"
                                        placeholder="e.g. 2024 or Pursuing"
                                        value={formData.passingYear}
                                        onChange={handleChange}
                                        className="input input-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm"
                                    />
                                </FormField>
                            </div>

                            {/* ── Skills ──────────────────────────────────────────────── */}
                            <div className="divider text-xs text-gray-400 font-semibold uppercase tracking-wider my-0">Skills</div>

                            <FormField label="Skills" required={false}>
                                <div
                                    className="flex flex-wrap gap-2 min-h-[44px] w-full px-3 py-2 rounded-lg border border-base-300 bg-white hover:bg-gray-50 shadow-sm focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all cursor-text"
                                    onClick={() => (document.getElementById('skill-input') as HTMLInputElement)?.focus()}
                                >
                                    {formData.skills.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); removeSkill(tag); }}
                                                className="hover:text-error transition-colors ml-0.5"
                                                aria-label={`Remove ${tag}`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                    <input
                                        id="skill-input"
                                        type="text"
                                        value={formData.skillInput}
                                        onChange={handleSkillInputChange}
                                        onKeyDown={handleSkillKeyDown}
                                        placeholder={formData.skills.length === 0 ? "Type a skill and press Enter or comma…" : "Add more…"}
                                        className="flex-1 min-w-[140px] outline-none bg-transparent text-sm placeholder:text-gray-400"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Press <kbd className="kbd kbd-xs">Enter</kbd> or type a comma to add each skill</p>
                            </FormField>

                            {/* ── Cover Note ──────────────────────────────────────────── */}
                            <div className="divider text-xs text-gray-400 font-semibold uppercase tracking-wider my-0">Cover Note</div>

                            <FormField label="Cover Note / Message" required={false}>
                                <textarea
                                    name="coverNote"
                                    placeholder="Tell us why you're a great fit for this role…"
                                    value={formData.coverNote}
                                    onChange={handleChange}
                                    rows={4}
                                    className="textarea textarea-bordered w-full text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all bg-white hover:bg-gray-50 shadow-sm resize-none"
                                />
                            </FormField>

                            {/* Submit error */}
                            {errors.submit && (
                                <div className="alert alert-error text-sm py-3 rounded-xl shadow-lg border border-error/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{errors.submit}</span>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex justify-end mt-2 pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-accent w-full md:w-auto px-10 uppercase shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100 rounded-xl text-base font-semibold"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm" />
                                            Submitting…
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Backdrop click to close */}
                <form method="dialog" className="modal-backdrop">
                    <button type="submit" onClick={closeModal}>
                        close
                    </button>
                </form>
            </dialog>
        </>
    );
}

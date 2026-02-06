"use client";

import { twMerge } from "tailwind-merge";
import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import { FORMSPREE_ENDPOINT } from "@/lib/constants";

// ── Shared types ─────────────────────────────────────────────────────

interface FormData {
  email: string;
  name: string;
  phone: string;
  experience: string;
  certification: "Yes" | "No";
  organization: string;
  state: string;
  course?: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  phone?: string;
  organization?: string;
  state?: string;
  submit?: string;
}

const EXPERIENCES = [
  "Student",
  "Fresher / 0 years",
  "1 year",
  "1-2 year",
  "2-3 year",
  "3-5 year",
  "5-8 year",
  "8+ years",
] as const;

const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

const DEFAULT_STATE: FormData = {
  email: "",
  name: "",
  phone: "",
  experience: "Student",
  certification: "No",
  organization: "",
  state: "",
};

// ── Custom Dropdown Component ───────────────────────────────────────

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: string;
  showSearch?: boolean;
}

function CustomSelect({ value, onChange, options, placeholder = "Select...", showSearch = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = showSearch
    ? options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus search input when dropdown opens (only if search is enabled)
      if (showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showSearch]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          "input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm text-left flex items-center justify-between",
          !value && "text-gray-400"
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        <svg
          className={twMerge(
            "w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Search Input - Conditionally Rendered */}
          {showSearch && (
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={twMerge(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-primary/5 flex items-center justify-between group",
                    value === option && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <span>{option}</span>
                  {value === option && (
                    <svg
                      className="w-4 h-4 text-primary"
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
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-2 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared validation ────────────────────────────────────────────────

function validateForm(formData: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!formData.email) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(formData.email))
    errors.email = "Please enter a valid email";
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!formData.phone)
    errors.phone = "Phone number is required";
  else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
    errors.phone = "Please enter a valid 10-digit phone number";
  if (!formData.organization.trim())
    errors.organization = "College/Company is required";
  if (!formData.state.trim()) errors.state = "State is required";
  return errors;
}

// ── Shared form hook ─────────────────────────────────────────────────

function useContactForm(modalId: string) {
  const [formData, setFormData] = useState<FormData>(DEFAULT_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const reset = () => {
    setErrors({});
    setFormData(DEFAULT_STATE);
  };

  const openModal = (courseName?: string) => {
    reset();
    setIsClosing(false);
    if (courseName) setFormData((prev) => ({ ...prev, course: courseName }));
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    dialog?.showModal();
  };

  const closeModal = () => {
    setIsClosing(true);
    // Wait for the exit animation to finish before actually closing
    setTimeout(() => {
      const dialog = document.getElementById(modalId) as HTMLDialogElement;
      dialog?.close();
      setIsClosing(false);
    }, 200);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /** Restrict phone input to digits only */
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        reset();
        closeModal();
        toast.success("Thank You, Our Agents Will Contact You Soon.");
      } else {
        throw new Error("Form submission failed");
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isClosing,
    openModal,
    closeModal,
    handleChange,
    handlePhoneChange,
    handleSubmit,
  };
}

// ── ContactUsButton ─────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost";

interface ContactUsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  outline: "btn-outline btn-primary",
  ghost: "btn-ghost",
};

export function ContactUsButton({
  text,
  variant = "primary",
  className,
  ...props
}: ContactUsButtonProps) {
  const MODAL_ID = "contact_modal";
  const form = useContactForm(MODAL_ID);

  return (
    <>
      <button
        onClick={() => form.openModal()}
        className={twMerge(
          "btn uppercase font-sans rounded-md md:btn-md",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {text ?? "Enquire Now"}
      </button>

      <dialog id={MODAL_ID} className="modal font-sans backdrop-blur-sm">
        <div
          className={twMerge(
            "modal-box max-w-3xl bg-gradient-to-br from-white to-gray-50 flex flex-col no-scrollbar items-stretch gap-6 transition-all duration-300 shadow-2xl border border-gray-100 rounded-2xl p-8",
            form.isClosing
              ? "scale-95 opacity-0"
              : "scale-100 opacity-100"
          )}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="font-bold text-3xl text-black/80 underline decoration-4 decoration-orange-500">
                Enquiry Form
              </h3>
              <p className="text-sm text-gray-500 mt-1">Fill in your details and we'll get back to you soon</p>
            </div>
            <button
              onClick={form.closeModal}
              className="btn btn-circle btn-ghost btn-sm hover:bg-gray-100 hover:rotate-90 transition-all duration-300"
              aria-label="Close"
            >
              <CgClose className="w-5 h-5" />
            </button>
          </div>

          <SharedForm form={form} modalId={MODAL_ID} />
        </div>
        {/* Backdrop — click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={form.closeModal}>close</button>
        </form>
      </dialog>
    </>
  );
}

// ── Shared Form Body ────────────────────────────────────────────────

function SharedForm({
  form,
}: {
  form: ReturnType<typeof useContactForm>;
  modalId: string;
}) {
  return (
    <form
      onSubmit={form.handleSubmit}
      method="dialog"
      className="flex flex-col w-full gap-5 mt-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Name" error={form.errors.name}>
          <div className="relative group">
            <input
              type="text"
              name="name"
              placeholder="Your Full Name"
              value={form.formData.name}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>

        <FormField label="Email" error={form.errors.email}>
          <div className="relative group">
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              spellCheck={false}
              value={form.formData.email}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Phone Number" error={form.errors.phone}>
          <div className="relative group">
            <input
              type="tel"
              name="phone"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={form.formData.phone}
              onChange={form.handlePhoneChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>

        <FormField label="State / Union Territory" error={form.errors.state}>
          <CustomSelect
            value={form.formData.state}
            onChange={(value) => {
              const syntheticEvent = {
                target: { name: "state", value },
              } as ChangeEvent<HTMLSelectElement>;
              form.handleChange(syntheticEvent);
            }}
            options={INDIAN_STATES}
            placeholder="Choose your State/UT"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Work Experience">
          <CustomSelect
            value={form.formData.experience}
            onChange={(value) => {
              const syntheticEvent = {
                target: { name: "experience", value },
              } as ChangeEvent<HTMLSelectElement>;
              form.handleChange(syntheticEvent);
            }}
            options={EXPERIENCES}
            placeholder="Select your experience"
            showSearch={false}
          />
        </FormField>

        <FormField label="College/Company" error={form.errors.organization}>
          <div className="relative group">
            <input
              type="text"
              name="organization"
              placeholder="Where do you study/work?"
              value={form.formData.organization}
              onChange={form.handleChange}
              className="input input-bordered w-full text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white hover:bg-gray-50 shadow-sm"
            />
          </div>
        </FormField>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-gray-700 block">
          Do you already have a certification?*
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="certification"
              value="No"
              checked={form.formData.certification === "No"}
              onChange={form.handleChange}
              className="radio radio-sm checked:bg-primary border-2 group-hover:border-primary transition-colors"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">No</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="certification"
              value="Yes"
              checked={form.formData.certification === "Yes"}
              onChange={form.handleChange}
              className="radio radio-sm checked:bg-primary border-2 group-hover:border-primary transition-colors"
            />
            <span className="text-sm font-medium group-hover:text-primary transition-colors">Yes</span>
          </label>
        </div>
      </div>

      {form.errors.submit && (
        <div className="alert alert-error text-sm py-3 rounded-xl shadow-lg border border-error/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{form.errors.submit}</span>
        </div>
      )}

      <div className="flex justify-end mt-2 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={form.isSubmitting}
          className="btn btn-primary w-full md:w-auto px-10 uppercase shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:scale-100 rounded-xl text-base font-semibold"
        >
          {form.isSubmitting ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending...
            </>
          ) : (
            <>
              Submit Enquiry
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// ── Form Field ──────────────────────────────────────────────────────

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-semibold text-gray-700">
        {label}<span className="text-error ml-0.5">*</span>
      </label>
      {children}
      {error && (
        <p className="text-error text-xs mt-2 ml-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

"use client";

import { twMerge } from "tailwind-merge";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { CgClose } from "react-icons/cg";
import Container from "@/components/ui/container";
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

const DEFAULT_STATE: FormData = {
  email: "",
  name: "",
  phone: "",
  experience: "Student",
  certification: "No",
  organization: "",
  state: "",
};

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

  const reset = () => {
    setErrors({});
    setFormData(DEFAULT_STATE);
  };

  const openModal = (courseName?: string) => {
    reset();
    if (courseName) setFormData((prev) => ({ ...prev, course: courseName }));
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    dialog?.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement;
    dialog?.close();
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

      <dialog id={MODAL_ID} className="modal font-sans">
        <div className="modal-box bg-white flex flex-col no-scrollbar items-stretch gap-6">
          <div className="flex justify-between">
            <h3 className="font-bold text-2xl underline underline-offset-8 decoration-accent">
              Enquiry Form
            </h3>
            <CgClose
              className="btn btn-circle btn-ghost btn-xs cursor-pointer"
              onClick={form.closeModal}
            />
          </div>

          <SharedForm form={form} modalId={MODAL_ID} />
        </div>
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
      className="flex flex-col w-full"
    >
      <FormField label="Email" error={form.errors.email}>
        <input
          type="email"
          name="email"
          spellCheck={false}
          value={form.formData.email}
          onChange={form.handleChange}
          className="input focus:outline-none focus:border-primary input-bordered w-full text-sm"
        />
      </FormField>

      <FormField label="Name" error={form.errors.name}>
        <input
          type="text"
          name="name"
          value={form.formData.name}
          onChange={form.handleChange}
          className="input focus:outline-none focus:border-primary input-bordered w-full text-sm"
        />
      </FormField>

      <FormField label="Phone Number" error={form.errors.phone}>
        <input
          type="tel"
          name="phone"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={10}
          placeholder="10-digit number"
          value={form.formData.phone}
          onChange={form.handlePhoneChange}
          className="input focus:outline-none focus:border-primary input-bordered w-full text-sm"
        />
      </FormField>

      <Container className="flex w-full gap-6 px-0 lg:px-0 mt-0 mb-6 my-0">
        <div className="flex-1 flex flex-col">
          <label className="mb-1 text-xs ml-2">Work Experience*</label>
          <select
            name="experience"
            value={form.formData.experience}
            onChange={form.handleChange}
            className="select select-bordered focus:outline-none focus:border-primary text-sm"
          >
            {EXPERIENCES.map((exp) => (
              <option key={exp}>{exp}</option>
            ))}
          </select>
        </div>

        <FormField label="College/Current Company" error={form.errors.organization}>
          <input
            type="text"
            name="organization"
            value={form.formData.organization}
            onChange={form.handleChange}
            className="input focus:outline-none focus:border-primary input-bordered w-full text-sm"
          />
        </FormField>
      </Container>

      <FormField label="State" error={form.errors.state}>
        <input
          type="text"
          name="state"
          value={form.formData.state}
          onChange={form.handleChange}
          className="input focus:outline-none focus:border-primary input-bordered w-full text-sm"
        />
      </FormField>

      <div className="mb-6 flex flex-col">
        <label className="mb-1 text-xs ml-2 capitalize">
          Do you already have a certification?*
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="certification"
          value="No"
          checked={form.formData.certification === "No"}
          onChange={form.handleChange}
          className="radio checked:bg-orange-500 checked:outline-2 checked:border-orange-200"
        />
        <span className="text-sm">No</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="certification"
          value="Yes"
          checked={form.formData.certification === "Yes"}
          onChange={form.handleChange}
          className="radio checked:bg-orange-500 checked:outline-2 checked:border-orange-200"
        />
        <span className="text-sm">Yes</span>
          </label>
        </div>
      </div>

      {form.errors.submit && (
        <p className="text-red-500 text-sm mb-4">{form.errors.submit}</p>
      )}

      <button
        type="submit"
        disabled={form.isSubmitting}
        className="btn btn-primary w-[30%] my-6 uppercase"
      >
        {form.isSubmitting ? "Submitting..." : "Submit"}
      </button>
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
    <div className="mb-6 flex-1 flex flex-col">
      <label className="mb-1 text-xs ml-2">{label}*</label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>
      )}
    </div>
  );
}

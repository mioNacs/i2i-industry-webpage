'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { CourseTier } from '@/lib/contentful/types/courses';
import { useRazorpay } from '@/hooks/use-razorpay';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CgClose } from 'react-icons/cg';
import type { CreateOrderResponse, VerifyPaymentResponse } from '@/types/razorpay';

// ── Types ─────────────────────────────────────────────────────

interface EnrollmentFormProps {
  modalId?: string;
  courseId: string;
  courseTitle: string;
  tier: CourseTier;
  user: {
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
    };
  };
  onClose?: () => void;
  onSuccess?: () => void;
  remainingPaymentMode?: boolean;  // If true, show only remaining payment button
  remainingAmount?: number;         // Remaining amount to pay
  standalone?: boolean;             // Render as a standalone component on page
}

interface FormData {
  mobileNo: string;
  alternateMobileNo: string;
  selectedCourseMode: string;
  partialAmount: number;
}

interface FormErrors {
  mobileNo?: string;
  alternateMobileNo?: string;
  selectedCourseMode?: string;
  partialAmount?: string;
}

// ── Helper Functions ─────────────────────────────────────────────────────

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// ── Component ─────────────────────────────────────────────────────

export default function EnrollmentForm({
  modalId = 'enrollment-modal',
  courseId,
  courseTitle,
  tier,
  user,
  onClose,
  onSuccess,
  remainingPaymentMode = false,
  remainingAmount = 0,
  standalone = false,
}: EnrollmentFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const { isLoaded: isRazorpayLoaded, openPayment } = useRazorpay();

  // Determine if course mode is selectable
  // courseMode can be "Online", "Offline", or "Both"
  const courseMode = tier.courseMode || 'Online';
  const isBothModes = courseMode === 'Both';
  const availableModes = isBothModes ? ['Online', 'Offline'] : [courseMode as string];

  // Calculate total amount with GST (in rupees)
  const baseAmount = tier.programFees;
  const gstAmount = tier.gstPercentage ? (baseAmount * tier.gstPercentage) / 100 : 0;
  const totalAmount = Math.round(baseAmount + gstAmount); // in rupees
  const BOOK_SLOT_AMOUNT = 1000; // Fixed ₹1000 for slot booking

  // Form state
  const [formData, setFormData] = useState<FormData>({
    mobileNo: '',
    alternateMobileNo: '',
    selectedCourseMode: availableModes[0],
    partialAmount: BOOK_SLOT_AMOUNT,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'full' | 'partial' | null>(null);

  // Open/close modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose?.();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (!validatePhone(formData.mobileNo)) {
      newErrors.mobileNo = 'Please enter a valid 10-digit mobile number';
    }

    if (formData.alternateMobileNo && !validatePhone(formData.alternateMobileNo)) {
      newErrors.alternateMobileNo = 'Please enter a valid 10-digit mobile number';
    }

    if (isBothModes && !formData.selectedCourseMode) {
      newErrors.selectedCourseMode = 'Please select a course mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save lead to database
  const saveLead = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/enrollment/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          fullName: user.user_metadata?.full_name || '',
          mobileNo: formData.mobileNo,
          alternateMobileNo: formData.alternateMobileNo || null,
          courseId,
          courseTitle,
          tierId: tier.sys.id,
          tierTitle: tier.title,
          durationMonths: tier.durationMonths,
          durationHours: tier.durationHours,
          courseMode: formData.selectedCourseMode,
          totalAmount,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save enrollment data');
      }
      return data.leadId;
    } catch (error: any) {
      console.error('Error saving lead:', error);
      toast.error('Failed to save enrollment data');
      return null;
    }
  };

  // Process payment
  const processPayment = async (paymentType: 'full' | 'partial') => {
    if (!validateForm()) return;

    if (!isRazorpayLoaded) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }

    setIsProcessing(true);
    setPaymentMode(paymentType);
    const loadingToast = toast.loading('Preparing payment...');

    try {
      // Save lead first
      const leadId = await saveLead();
      if (!leadId) {
        throw new Error('Failed to save enrollment data');
      }

      // Determine the amount based on mode
      let amount: number;
      let actualPaymentType: 'full' | 'partial' = paymentType;
      
      if (remainingPaymentMode && remainingAmount > 0) {
        // Paying remaining amount - treat as completing the full payment
        amount = remainingAmount;
        actualPaymentType = 'full'; // This completes the payment
      } else {
        amount = paymentType === 'full' ? totalAmount : BOOK_SLOT_AMOUNT;
      }

      // Create order
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          courseTierId: tier.sys.id,
          courseTitle,
          tierTitle: tier.title,
          amount,
          leadId,
          paymentType: actualPaymentType,
          totalCourseAmount: totalAmount,
          mobileNo: formData.mobileNo,
          alternateMobileNo: formData.alternateMobileNo || null,
          courseMode: formData.selectedCourseMode,
          durationMonths: tier.durationMonths,
          durationHours: tier.durationHours,
          isRemainingPayment: remainingPaymentMode,
        }),
      });

      const orderData: CreateOrderResponse = await orderResponse.json();

      if (!orderData.success || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      toast.dismiss(loadingToast);

      // Open Razorpay checkout
      const paymentResponse = await openPayment({
        amount: orderData.amount!,
        currency: orderData.currency!,
        name: 'i2i Industry',
        description: `${courseTitle} - ${tier.title}${remainingPaymentMode ? ' (Remaining Payment)' : actualPaymentType === 'partial' ? ' (Slot Booking)' : ''}`,
        order_id: orderData.orderId,
        prefill: {
          email: user.email,
          name: user.user_metadata?.full_name || '',
          contact: formData.mobileNo,
        },
        notes: {
          courseId,
          courseTierId: tier.sys.id,
          leadId,
          paymentType: actualPaymentType,
        },
        theme: {
          color: '#6366f1',
        },
      });

      // Verify payment
      const verifyLoadingToast = toast.loading('Verifying payment...');

      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          courseId,
          courseTierId: tier.sys.id,
          amount,
          leadId,
          paymentType: actualPaymentType,
          totalCourseAmount: totalAmount,
          mobileNo: formData.mobileNo,
          alternateMobileNo: formData.alternateMobileNo || null,
          courseMode: formData.selectedCourseMode,
          courseTitle,
          tierTitle: tier.title,
          durationMonths: tier.durationMonths,
          durationHours: tier.durationHours,
          isRemainingPayment: remainingPaymentMode,
        }),
      });

      const verifyData: VerifyPaymentResponse = await verifyResponse.json();
      toast.dismiss(verifyLoadingToast);

      if (!verifyData.success) {
        throw new Error(verifyData.error || 'Payment verification failed');
      }

      // Success!
      let successMessage: string;
      if (remainingPaymentMode) {
        successMessage = '🎉 Payment complete! You now have full access to the course!';
      } else if (actualPaymentType === 'full') {
        successMessage = '🎉 Enrollment successful! Welcome to the course!';
      } else {
        successMessage = '🎉 Slot booked successfully! Complete your payment to unlock full access.';
      }
      toast.success(successMessage);

      // Close modal and redirect
      dialogRef.current?.close();
      onSuccess?.();

      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error: any) {
      toast.dismiss(loadingToast);

      if (error.message === 'Payment cancelled by user') {
        toast.error('Payment cancelled');
      } else {
        console.error('Payment error:', error);
        toast.error(error.message || 'Payment failed. Please try again.');
      }
    } finally {
      setIsProcessing(false);
      setPaymentMode(null);
    }
  };

  // Handle form value changes
  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Open modal
  const openModal = () => {
    dialogRef.current?.showModal();
  };

  // Close modal
  const closeModal = () => {
    dialogRef.current?.close();
  };

  const formContent = (
    <div className={standalone ? "w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-100" : "modal-box max-w-2xl max-h-[90vh] bg-white p-0 flex flex-col"}>
      {/* Header */}
      <div className="bg-primary p-6 sm:p-8 text-white shrink-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">Enroll in Course</h3>
            <p className="text-white/90 text-sm sm:text-base mt-2 font-medium">{courseTitle} - {tier.title}</p>
          </div>
          {!standalone && (
            <button
              onClick={closeModal}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20 mt-1"
            >
              <CgClose className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className={`p-6 sm:p-8 space-y-8 ${standalone ? '' : 'overflow-y-auto flex-1'}`}>
        {/* Course Details (Read-only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Course Name</span>
            </label>
            <input
              type="text"
              value={courseTitle}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Tier</span>
            </label>
            <input
              type="text"
              value={tier.title}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Duration (Months)</span>
            </label>
            <input
              type="text"
              value={tier.durationMonths}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Duration (Hours)</span>
            </label>
            <input
              type="text"
              value={`${tier.durationHours} Hours`}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          {/* Course Mode - Dropdown if "Both", readonly if single mode */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Course Mode</span>
            </label>
            {isBothModes ? (
              <select
                value={formData.selectedCourseMode}
                onChange={(e) => handleChange('selectedCourseMode', e.target.value)}
                className={`select select-bordered text-base font-medium ${errors.selectedCourseMode ? 'select-error' : ''}`}
              >
                {availableModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={availableModes[0]}
                readOnly
                className="input input-bordered bg-gray-50 text-gray-700 font-medium"
              />
            )}
            {errors.selectedCourseMode && (
              <label className="label">
                <span className="label-text-alt text-error font-medium">{errors.selectedCourseMode}</span>
              </label>
            )}
          </div>

          {/* Total Amount */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Total Amount</span>
            </label>
            <input
              type="text"
              value={`${formatCurrency(totalAmount)} (incl. GST)`}
              readOnly
              className="input input-bordered bg-blue-50/50 text-blue-700 font-bold border-blue-200"
            />
          </div>
        </div>

        <div className="divider text-gray-400 text-sm font-semibold uppercase tracking-wider">Your Details</div>

        {/* User Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Email</span>
            </label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Full Name</span>
            </label>
            <input
              type="text"
              value={user.user_metadata?.full_name || ''}
              readOnly
              className="input input-bordered bg-gray-50 text-gray-700 font-medium"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Mobile Number <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={formData.mobileNo}
              onChange={(e) => handleChange('mobileNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`input input-bordered text-base font-medium focus:border-primary ${errors.mobileNo ? 'input-error' : ''}`}
              maxLength={10}
            />
            {errors.mobileNo && (
              <label className="label pt-1 pb-0">
                <span className="label-text-alt text-error font-medium">{errors.mobileNo}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">Alternate Mobile No.</span>
            </label>
            <input
              type="tel"
              placeholder="Optional"
              value={formData.alternateMobileNo}
              onChange={(e) => handleChange('alternateMobileNo', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={`input input-bordered text-base font-medium focus:border-primary ${errors.alternateMobileNo ? 'input-error' : ''}`}
              maxLength={10}
            />
            {errors.alternateMobileNo && (
              <label className="label pt-1 pb-0">
                <span className="label-text-alt text-error font-medium">{errors.alternateMobileNo}</span>
              </label>
            )}
          </div>
        </div>

        {/* Payment Buttons */}
        {remainingPaymentMode && remainingAmount > 0 ? (
          // Remaining Payment Mode - Show only pay remaining button
          <div className="flex flex-col gap-4 pt-6">
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-amber-100 p-2 rounded-full hidden sm:block">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-amber-900 font-semibold mb-1">
                    You have booked a slot
                  </p>
                  <p className="text-amber-800 text-sm mt-1">
                    Pay the remaining amount to unlock full access to the course content and mentorship.
                  </p>
                  <p className="text-amber-700 font-bold mt-2">
                    Remaining Amount: {formatCurrency(remainingAmount)}
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => processPayment('full')}
              disabled={isProcessing}
              className="btn btn-accent w-full h-14 text-lg rounded-xl mt-2 mx-auto sm:max-w-xs shadow-lg shadow-accent/25 hover:shadow-accent/40"
            >
              {isProcessing ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Processing...
                </>
              ) : (
                <>
                  Pay Remaining
                  <span className="text-sm font-normal opacity-90 tracking-wide ml-1">({formatCurrency(remainingAmount)})</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // Normal Mode - Show both buttons
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 mt-4 items-center justify-center">
            <button
              onClick={() => processPayment('partial')}
              disabled={isProcessing}
              className="btn btn-outline btn-primary flex-1 h-14 text-lg rounded-xl border-2 hover:bg-primary/10 hover:text-primary w-full max-w-sm"
            >
              {isProcessing && paymentMode === 'partial' ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Processing...
                </>
              ) : (
                <>
                  Book Your Slot
                  <span className="text-sm font-semibold tracking-wide ml-1 opacity-90">({formatCurrency(BOOK_SLOT_AMOUNT)})</span>
                </>
              )}
            </button>

            <button
              onClick={() => processPayment('full')}
              disabled={isProcessing}
              className="btn btn-primary flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 text-white w-full max-w-sm"
            >
              {isProcessing && paymentMode === 'full' ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Processing...
                </>
              ) : (
                <>
                  Enroll Now
                  <span className="text-sm tracking-wide ml-1 font-semibold opacity-90">({formatCurrency(totalAmount)})</span>
                </>
              )}
            </button>
          </div>
        )}

        <div className="text-center pb-2">
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            By proceeding, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline font-medium" target="_blank">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-primary hover:underline font-medium" target="_blank">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return formContent;
  }

  return (
    <dialog
      ref={dialogRef}
      id={modalId}
      className="modal modal-bottom sm:modal-middle"
    >
      {formContent}
      {/* Backdrop click to close */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

// ── Hook for external modal control ─────────────────────────────────────────────────────

export function useEnrollmentForm(modalId: string) {
  const openModal = () => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
    dialog?.showModal();
  };

  const closeModal = () => {
    const dialog = document.getElementById(modalId) as HTMLDialogElement | null;
    dialog?.close();
  };

  return { openModal, closeModal };
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RazorpayOptions, RazorpayResponse, RazorpayInstance, OpenPaymentOptions } from '@/types/razorpay';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

interface UseRazorpayReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  openPayment: (options: OpenPaymentOptions) => Promise<RazorpayResponse>;
}

export function useRazorpay(): UseRazorpayReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Razorpay script
  useEffect(() => {
    // Check if already loaded
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script is already in DOM
    const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existingScript) {
      // Wait for it to load
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    setIsLoading(true);
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setError(null);
    };

    script.onerror = () => {
      setError('Failed to load payment gateway. Please refresh and try again.');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup not needed as we want to keep the script
    };
  }, []);

  const openPayment = useCallback(
    (options: OpenPaymentOptions): Promise<RazorpayResponse> => {
      return new Promise((resolve, reject) => {
        if (!isLoaded || !window.Razorpay) {
          reject(new Error('Payment gateway not loaded. Please refresh the page.'));
          return;
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          reject(new Error('Payment configuration error. Please contact support.'));
          return;
        }

        const razorpayOptions: RazorpayOptions = {
          ...options,
          key: razorpayKey,
          handler: (response: RazorpayResponse) => {
            resolve(response);
          },
          modal: {
            ...options.modal,
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        try {
          const razorpayInstance: RazorpayInstance = new window.Razorpay(razorpayOptions);
          
          razorpayInstance.on('payment.failed', (response: any) => {
            reject(new Error(response.error?.description || 'Payment failed'));
          });

          razorpayInstance.open();
        } catch (err: any) {
          reject(new Error(err.message || 'Failed to open payment'));
        }
      });
    },
    [isLoaded]
  );

  return {
    isLoaded,
    isLoading,
    error,
    openPayment,
  };
}

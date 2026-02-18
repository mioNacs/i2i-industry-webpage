-- SQL to update enrollments table to include payment details
-- Run this in your Supabase SQL editor

-- Add payment columns to enrollments table
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS amount_paid INTEGER, -- Amount in paise
ADD COLUMN IF NOT EXISTS tier_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_id ON enrollments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_order_id ON enrollments(razorpay_order_id);

-- Add unique constraint to prevent duplicate payments
ALTER TABLE enrollments 
ADD CONSTRAINT unique_payment_id UNIQUE (razorpay_payment_id);

-- Policy for enrollments (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'enrollments' AND policyname = 'Users can insert own enrollments'
    ) THEN
        CREATE POLICY "Users can insert own enrollments" ON enrollments
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

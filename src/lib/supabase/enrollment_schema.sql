-- SQL to create enrollment_leads table and update enrollments table
-- Run this in your Supabase SQL editor

-- =============================================
-- Table 1: enrollment_leads
-- Users who opened/filled form but didn't pay
-- =============================================
CREATE TABLE IF NOT EXISTS enrollment_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  mobile_no TEXT NOT NULL,
  alternate_mobile_no TEXT,
  course_id TEXT NOT NULL,
  course_title TEXT NOT NULL,
  tier_id TEXT NOT NULL,
  tier_title TEXT NOT NULL,
  duration_months TEXT,
  duration_hours INTEGER,
  course_mode TEXT NOT NULL,
  total_amount INTEGER NOT NULL, -- in rupees
  created_at TIMESTAMPTZ DEFAULT NOW(),
  converted_at TIMESTAMPTZ -- set when payment made
);

-- RLS Policies for enrollment_leads
ALTER TABLE enrollment_leads ENABLE ROW LEVEL SECURITY;

-- Users can insert their own leads
CREATE POLICY "Users can insert own leads" ON enrollment_leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own leads
CREATE POLICY "Users can view own leads" ON enrollment_leads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own leads (for converted_at)
CREATE POLICY "Users can update own leads" ON enrollment_leads
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can do everything (for admin/backend operations)
CREATE POLICY "Service role full access to leads" ON enrollment_leads
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enrollment_leads_user_id ON enrollment_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_leads_course_id ON enrollment_leads(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_leads_created_at ON enrollment_leads(created_at DESC);

-- =============================================
-- Table 2: Update enrollments table
-- Add columns for partial payment tracking
-- =============================================
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES enrollment_leads(id),
ADD COLUMN IF NOT EXISTS mobile_no TEXT,
ADD COLUMN IF NOT EXISTS alternate_mobile_no TEXT,
ADD COLUMN IF NOT EXISTS course_mode TEXT,
ADD COLUMN IF NOT EXISTS course_title TEXT,
ADD COLUMN IF NOT EXISTS tier_title TEXT,
ADD COLUMN IF NOT EXISTS duration_months TEXT,
ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
ADD COLUMN IF NOT EXISTS total_course_amount INTEGER, -- full price in rupees
ADD COLUMN IF NOT EXISTS payment_type TEXT CHECK (payment_type IN ('full', 'partial', 'emi')),
ADD COLUMN IF NOT EXISTS remaining_amount INTEGER DEFAULT 0, -- in rupees
ADD COLUMN IF NOT EXISTS partial_access_granted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS full_access_granted BOOLEAN DEFAULT false;

-- Create index for lead_id lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_lead_id ON enrollments(lead_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_payment_type ON enrollments(payment_type);

-- =============================================
-- Helper function to update lead conversion status
-- =============================================
CREATE OR REPLACE FUNCTION update_lead_conversion()
RETURNS TRIGGER AS $$
BEGIN
  -- When an enrollment is created with a lead_id, update the lead's converted_at
  IF NEW.lead_id IS NOT NULL AND NEW.payment_status = 'completed' THEN
    UPDATE enrollment_leads
    SET converted_at = NOW()
    WHERE id = NEW.lead_id AND converted_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update lead conversion
DROP TRIGGER IF EXISTS trigger_update_lead_conversion ON enrollments;
CREATE TRIGGER trigger_update_lead_conversion
  AFTER INSERT OR UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_conversion();

-- =============================================
-- View for unconverted leads (for admin dashboard)
-- =============================================
CREATE OR REPLACE VIEW unconverted_leads AS
SELECT 
  el.*,
  p.avatar_url,
  EXTRACT(EPOCH FROM (NOW() - el.created_at)) / 3600 AS hours_since_created
FROM enrollment_leads el
LEFT JOIN profiles p ON el.user_id = p.id
WHERE el.converted_at IS NULL
ORDER BY el.created_at DESC;

-- Grant access to authenticated users for the view
GRANT SELECT ON unconverted_leads TO authenticated;

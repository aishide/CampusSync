-- Fix the complaints table to use auth.users instead of profiles for foreign keys
-- Run this SQL in your Supabase SQL Editor

-- First, drop the existing foreign key constraint
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_submitted_by_fkey;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_assigned_to_fkey;

-- Update the foreign key to reference auth.users instead of profiles
ALTER TABLE complaints 
  ADD CONSTRAINT complaints_submitted_by_fkey 
  FOREIGN KEY (submitted_by) REFERENCES auth.users(id);

ALTER TABLE complaints 
  ADD CONSTRAINT complaints_assigned_to_fkey 
  FOREIGN KEY (assigned_to) REFERENCES auth.users(id);

-- Update the RLS policies to work correctly
DROP POLICY IF EXISTS "Users can create complaints" ON complaints;
CREATE POLICY "Users can create complaints"
  ON complaints FOR INSERT
  WITH CHECK (submitted_by = auth.uid());

DROP POLICY IF EXISTS "Users can view complaints they submitted or are assigned to" ON complaints;
CREATE POLICY "Users can view complaints they submitted or are assigned to"
  ON complaints FOR SELECT
  USING (
    submitted_by = auth.uid() 
    OR assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

DROP POLICY IF EXISTS "Faculty and admins can update complaints" ON complaints;
CREATE POLICY "Faculty and admins can update complaints"
  ON complaints FOR UPDATE
  USING (
    assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

-- Also fix the timeline policies
DROP POLICY IF EXISTS "Faculty and admins can create timeline entries" ON complaint_timeline;
CREATE POLICY "Faculty and admins can create timeline entries"
  ON complaint_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'faculty')
    )
  );

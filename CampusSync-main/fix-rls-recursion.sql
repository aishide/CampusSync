-- Fix infinite recursion in RLS policies
-- Run this SQL in your Supabase SQL Editor

-- Drop all existing policies to break the recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view complaints they submitted or are assigned to" ON complaints;
DROP POLICY IF EXISTS "Users can create complaints" ON complaints;
DROP POLICY IF EXISTS "Faculty and admins can update complaints" ON complaints;

DROP POLICY IF EXISTS "Users can view timeline for accessible complaints" ON complaint_timeline;
DROP POLICY IF EXISTS "Faculty and admins can create timeline entries" ON complaint_timeline;

-- Create simplified, non-recursive policies

-- Profiles policies (simple and direct)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Complaints policies (direct checks without subqueries)
CREATE POLICY "Users can create complaints" ON complaints
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can view own complaints" ON complaints
  FOR SELECT USING (auth.uid() = submitted_by);

CREATE POLICY "Users can view assigned complaints" ON complaints
  FOR SELECT USING (auth.uid() = assigned_to);

-- Timeline policies
CREATE POLICY "Users can view own complaint timeline" ON complaint_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM complaints 
      WHERE complaints.id = complaint_timeline.complaint_id 
      AND (complaints.submitted_by = auth.uid() OR complaints.assigned_to = auth.uid())
    )
  );

CREATE POLICY "Users can create timeline for assigned complaints" ON complaint_timeline
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM complaints 
      WHERE complaints.id = complaint_timeline.complaint_id 
      AND (complaints.assigned_to = auth.uid())
    )
  );

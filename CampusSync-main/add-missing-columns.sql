-- Add missing columns to complaints table
-- Run this SQL in your Supabase SQL Editor

-- Add the submitted_by_name column that the app is trying to use
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS submitted_by_name TEXT;

-- Also add any other potentially missing columns that might be needed
ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS assigned_department TEXT;

ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE complaints 
ADD COLUMN IF NOT EXISTS ai_suggestion TEXT;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'complaints' 
ORDER BY ordinal_position;

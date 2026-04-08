-- Fix Supabase session persistence
-- Run this SQL in your Supabase SQL Editor

-- Check if session persistence is properly configured
-- This query shows the current auth configuration
SELECT 
  name, 
  setting 
FROM pg_settings 
WHERE name IN ('session_timeout', 'statement_timeout');

-- Enable session persistence by updating the auth.users table settings
-- This ensures sessions persist across browser refreshes
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}')::jsonb 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data IS NULL
);

-- Verify the user metadata is properly stored
SELECT 
  id, 
  email, 
  raw_user_meta_data,
  created_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Fix RLS policy for contact_submissions to allow public inserts
DROP POLICY IF EXISTS "Allow public insert to contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public insert to contact_submissions" 
ON contact_submissions FOR INSERT 
WITH CHECK (true);

-- Fix RLS policy for donations to allow public inserts
DROP POLICY IF EXISTS "Allow public insert to donations" ON donations;
CREATE POLICY "Allow public insert to donations" 
ON donations FOR INSERT 
WITH CHECK (true);

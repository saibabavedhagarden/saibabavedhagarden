GRANT ALL ON TABLE contact_submissions TO anon, authenticated, postgres, service_role;
GRANT ALL ON TABLE donations TO anon, authenticated, postgres, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;

DROP POLICY IF EXISTS "Allow public insert to contact_submissions" ON contact_submissions;
CREATE POLICY "Allow public insert to contact_submissions" 
ON contact_submissions FOR INSERT TO anon, authenticated, public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to donations" ON donations;
CREATE POLICY "Allow public insert to donations" 
ON donations FOR INSERT TO anon, authenticated, public
WITH CHECK (true);

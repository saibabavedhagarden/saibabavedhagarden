ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon insert to contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow all for contact_submissions" ON contact_submissions;
CREATE POLICY "Allow all for contact_submissions" ON contact_submissions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert to donations" ON donations;
DROP POLICY IF EXISTS "Allow all for donations" ON donations;
CREATE POLICY "Allow all for donations" ON donations FOR ALL USING (true) WITH CHECK (true);

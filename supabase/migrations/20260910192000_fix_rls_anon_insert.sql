ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable public insert for contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for all" ON contact_submissions;

CREATE POLICY "Enable insert for all" ON contact_submissions
  FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);

DROP POLICY IF EXISTS "Enable public insert for donations" ON donations;
DROP POLICY IF EXISTS "Enable insert for all" ON donations;

CREATE POLICY "Enable insert for all" ON donations
  FOR INSERT TO anon, authenticated, service_role WITH CHECK (true);

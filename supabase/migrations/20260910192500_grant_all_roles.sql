ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE contact_submissions TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE donations TO anon, authenticated, service_role, postgres;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;

DROP POLICY IF EXISTS "Enable public insert for contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for all" ON contact_submissions;
DROP POLICY IF EXISTS "Allow anon insert to contact_submissions" ON contact_submissions;
CREATE POLICY "Allow anon insert to contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable public insert for donations" ON donations;
DROP POLICY IF EXISTS "Enable insert for all" ON donations;
DROP POLICY IF EXISTS "Allow anon insert to donations" ON donations;
CREATE POLICY "Allow anon insert to donations" ON donations FOR INSERT WITH CHECK (true);

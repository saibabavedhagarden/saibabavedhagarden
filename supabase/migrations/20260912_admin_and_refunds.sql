-- Migration to support refund tracking in donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

-- Enable RLS update & select policies so updates work seamlessly
DROP POLICY IF EXISTS "Allow update to donations" ON donations;
CREATE POLICY "Allow update to donations" ON donations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow select to donations" ON donations;
CREATE POLICY "Allow select to donations" ON donations FOR SELECT USING (true);


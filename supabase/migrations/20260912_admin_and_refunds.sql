-- Migration to support refund tracking in donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

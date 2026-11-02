-- Migration to add remarks/notes column to donations table
ALTER TABLE donations 
ADD COLUMN IF NOT EXISTS remarks TEXT;

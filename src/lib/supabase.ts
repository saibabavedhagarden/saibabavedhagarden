import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://otbqkqalstdmpllspxin.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90YnFrcWFsc3RkbXBsbHNweGluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwMzgzMzAsImV4cCI6MjEwNDYxNDMzMH0.f5Ex4GC9r_B1Kt4NdsfdnwzAfLQDt-RQbR0sRYPOoZw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://otbqkqalstdmpllspxin.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_xpJNddaHZZqJdsVrnfIOMQ_pdte4g8x";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";
import { VITE_SUPABASE_ANON_KEY, SUPABASE_URL } from "@/shared/config";

export const client = createClient(SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

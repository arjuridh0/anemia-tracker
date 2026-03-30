import { createClient } from '@supabase/supabase-js';

// Membaca kredensial dari file .env (aman, tidak ter-commit ke GitHub)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

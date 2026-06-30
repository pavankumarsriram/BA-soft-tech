import { createClient } from '@supabase/supabase-js';

// These are public keys - it's safe to expose them in the frontend
// Replace with your actual Supabase credentials from https://supabase.com
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at startup rather than silently making broken requests later.
  console.error(
    'Missing Supabase config. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    '(see README.md for where to find these in your Supabase project).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

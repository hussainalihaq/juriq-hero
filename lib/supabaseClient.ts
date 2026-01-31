
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();


let client = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.warn('Failed to initialize Supabase client:', error);
    }
} else {
    console.warn('Missing Supabase environment variables. Supabase client will not be initialized.');
}

export const supabase = client;


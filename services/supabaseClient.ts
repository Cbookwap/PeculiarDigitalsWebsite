import { createClient } from '@supabase/supabase-js';

// Helper function to safely get environment variables without crashing
// This prevents the "Cannot read properties of undefined" error
const getEnv = (key: string, defaultValue: string): string => {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      // @ts-ignore
      const value = import.meta.env[key];
      if (value) return value;
    }
  } catch (e) {
    console.warn('Environment variable access failed', e);
  }
  return defaultValue;
}

// 1. Try to get keys from Vercel Environment Variables (VITE_ prefix is required)
// 2. If not found, use the Hardcoded keys below so the site works immediately.

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL', 'https://fqvsxaztaslyvcoqrrkp.supabase.co');
const SUPABASE_ANON_KEY = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdnN4YXp0YXNseXZjb3FycmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODgzMTksImV4cCI6MjA3OTk2NDMxOX0.Z5AiI1oks9FjEnuPWSGEAl2E852kMeAvwKl8vUkDhLM');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};
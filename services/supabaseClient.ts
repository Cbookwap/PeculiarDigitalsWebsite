import { createClient } from '@supabase/supabase-js';

// NOTE: In a real deployment, these should be environment variables.
// Since we are generating a frontend demo, these are placeholders.
// You must replace these with your actual Supabase URL and Anon Key.

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://fqvsxaztaslyvcoqrrkp.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxdnN4YXp0YXNseXZjb3FycmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzODgzMTksImV4cCI6MjA3OTk2NDMxOX0.Z5AiI1oks9FjEnuPWSGEAl2E852kMeAvwKl8vUkDhLM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
};
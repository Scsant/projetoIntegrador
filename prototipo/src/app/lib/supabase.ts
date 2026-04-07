import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = hasSupabaseEnv
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabaseDefaults = {
  calendarId: import.meta.env.VITE_SUPABASE_DEFAULT_CALENDAR_ID ?? '',
  userId: import.meta.env.VITE_SUPABASE_DEFAULT_USER_ID ?? '',
  avatarsBucket: import.meta.env.VITE_SUPABASE_AVATARS_BUCKET ?? 'avatars',
};

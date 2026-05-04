import { supabase } from '@/lib/supabaseClient';

export type UserRole = 'fan' | 'creator';

export type UpsertUserPayload = {
  id: string;                // uuid from auth.users
  email: string | null;      // from auth
  name: string;              // full name
  mobile: string;            // mobile number
  instagram?: string | null; // optional
  avatar_url?: string | null;// optional (public URL from storage)
  role: UserRole;            // 'fan' | 'creator'
};

/**
 * Upsert user profile into `public.users` table.
 * - Uses primary key (id) to avoid duplicates
 * - Safe to call multiple times
 */
export async function upsertUser(payload: UpsertUserPayload) {
  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('upsertUser error:', error);
  }

  return { data, error };
}

/**
 * Fetch user profile by id
 */
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getUserById error:', error);
  }

  return { data, error };
}

/**
 * Update partial user profile fields
 */
export async function updateUser(id: string, updates: Partial<UpsertUserPayload>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateUser error:', error);
  }

  return { data, error };
}

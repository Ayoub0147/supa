'use client';

import { supabase } from './supabaseClient';

export async function handleAuth(email: string, password: string) {
  console.log('typeof fetch:', typeof fetch); // must be 'function'
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
} 
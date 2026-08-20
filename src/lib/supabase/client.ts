import { createBrowserClient } from '@supabase/ssr';

export function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || (typeof window !== 'undefined' ? (window as any).__ENV?.NEXT_PUBLIC_SUPABASE_URL : '') || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (typeof window !== 'undefined' ? (window as any).__ENV?.NEXT_PUBLIC_SUPABASE_ANON_KEY : '') || '';

  return createBrowserClient(url, key);
}

import { supabase } from '../lib/supabase';

export async function ensureUserRecordExists(user: { id: string; email?: string | null; user_metadata?: any } | null) {
  if (!user) return;

  const id = (user as any).id;
  const email = (user as any).email ?? (user as any).user_metadata?.email ?? null;
  const full_name = (user as any).user_metadata?.full_name ?? null;

  // Try upserting into common profile tables that projects use.
  // We attempt `profiles` then `users` to increase compatibility with different schemas.
  try {
    const { error: pErr } = await supabase.from('profiles').upsert({ id, email, full_name }, { onConflict: 'id' });
    if (!pErr) return;
  } catch (e) {
    // ignore
  }

  try {
    const { error: uErr } = await supabase.from('users').upsert({ id, email }, { onConflict: 'id' });
    if (!uErr) return;
  } catch (e) {
    // ignore
  }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// This client bypasses Row Level Security entirely.
// NEVER import this in a client component or expose SUPABASE_SERVICE_ROLE_KEY to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
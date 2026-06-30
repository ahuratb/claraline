import { createClient } from '@supabase/supabase-js'

const url  = process.env.CENTRAL_SUPABASE_URL!
const anon = process.env.CENTRAL_SUPABASE_ANON_KEY!
const svc  = process.env.CENTRAL_SUPABASE_SERVICE_KEY!

/** Public read-only client — safe in Server Components */
export const centralDb = createClient(url, anon)

/** Admin client — ONLY in API routes / server actions */
export const centralDbAdmin = createClient(url, svc, {
  auth: { persistSession: false },
})

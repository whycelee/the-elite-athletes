
import { createClient } from '@supabase/supabase-js'
 
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!
 
// Untuk komponen browser (respects RLS security)
export const supabase = createClient(url, anon)
 
// Untuk API routes server-side (bypasses RLS, full access)
export const supabaseAdmin = createClient(url, svc, {
 auth: { autoRefreshToken: false, persistSession: false }
})
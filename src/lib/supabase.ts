import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// The app's own Supabase project backs only the older pages (orders, stages,
// vehicles…). Sign-in and auctions go through Valeron and need none of it, so a
// deployment without these keys must still build: the placeholders make those
// older routes fail when called, instead of failing the whole build.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://supabase-not-configured.invalid'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'not-configured'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client with service role for admin operations
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

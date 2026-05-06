// supabase.d.ts (raiz do projeto)
import type { Database } from './types/database'

declare module '@nuxtjs/supabase' {
  interface SupabaseDatabase extends Database {}
}
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          ativo: boolean
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          role?: string
          ativo?: boolean
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          ativo?: boolean
          created_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
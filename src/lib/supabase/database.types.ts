export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          created_at: string
          id: number
          name: string
          price: number
          sizes: string[]
          stripe_id: string
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          price: number
          sizes: string[]
          stripe_id: string
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          price?: number
          sizes?: string[]
          stripe_id?: string
          tags?: string[] | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

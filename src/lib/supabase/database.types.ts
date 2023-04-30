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
          active: boolean | null
          created_at: string | null
          description: string | null
          id: number
          images: string[] | null
          name: string
          price: number
          sizes: string[]
          stripe_id: string
          tags: string[] | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
          name: string
          price: number
          sizes: string[]
          stripe_id: string
          tags?: string[] | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: number
          images?: string[] | null
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

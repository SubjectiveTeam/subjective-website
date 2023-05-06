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
      order_products: {
        Row: {
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
      }
      orders: {
        Row: {
          address: string
          city: string
          created_at: string | null
          customer_email: string
          id: string
          postal_code: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          customer_email: string
          id: string
          postal_code: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          customer_email?: string
          id?: string
          postal_code?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
      }
      product_groups: {
        Row: {
          description: string
          id: string
          images: string[]
          name: string
        }
        Insert: {
          description: string
          id?: string
          images?: string[]
          name: string
        }
        Update: {
          description?: string
          id?: string
          images?: string[]
          name?: string
        }
      }
      products: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          price: number
          product_group_id: string
          size: Database["public"]["Enums"]["clothing_size"]
          stock: number
          stripe_price: string
        }
        Insert: {
          active: boolean
          created_at?: string | null
          id: string
          price: number
          product_group_id: string
          size: Database["public"]["Enums"]["clothing_size"]
          stock: number
          stripe_price: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          price?: number
          product_group_id?: string
          size?: Database["public"]["Enums"]["clothing_size"]
          stock?: number
          stripe_price?: string
        }
      }
    }
    Views: {
      product_groups_detailed: {
        Row: {
          description: string | null
          id: string | null
          images: string[] | null
          name: string | null
          products: unknown[] | null
        }
      }
    }
    Functions: {
      create_order: {
        Args: {
          order_info: Json
        }
        Returns: undefined
      }
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      clothing_size: "XL" | "L" | "M" | "S"
      order_status:
        | "ORDERED"
        | "PROCESSED"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

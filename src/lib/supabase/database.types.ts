export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			order_products: {
				Row: {
					id: string;
					order_id: string;
					product_id: string | null;
					quantity: number;
				};
				Insert: {
					id?: string;
					order_id: string;
					product_id?: string | null;
					quantity: number;
				};
				Update: {
					id?: string;
					order_id?: string;
					product_id?: string | null;
					quantity?: number;
				};
			};
			orders: {
				Row: {
					address: string;
					city: string;
					created_at: string | null;
					customer_email: string;
					id: string;
					postal_code: string;
					status: string;
				};
				Insert: {
					address: string;
					city: string;
					created_at?: string | null;
					customer_email: string;
					id: string;
					postal_code: string;
					status: string;
				};
				Update: {
					address?: string;
					city?: string;
					created_at?: string | null;
					customer_email?: string;
					id?: string;
					postal_code?: string;
					status?: string;
				};
			};
			products: {
				Row: {
					active: boolean;
					created_at: string | null;
					description: string;
					id: string;
					images: string[];
					name: string;
					price: number;
					size: string;
					stock: number;
					stripe_price: string;
					tags: string[];
				};
				Insert: {
					active: boolean;
					created_at?: string | null;
					description: string;
					id: string;
					images: string[];
					name: string;
					price: number;
					size: string;
					stock: number;
					stripe_price: string;
					tags: string[];
				};
				Update: {
					active?: boolean;
					created_at?: string | null;
					description?: string;
					id?: string;
					images?: string[];
					name?: string;
					price?: number;
					size?: string;
					stock?: number;
					stripe_price?: string;
					tags?: string[];
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_order: {
				Args: {
					order_info: Json;
				};
				Returns: undefined;
			};
			delete_claim: {
				Args: {
					uid: string;
					claim: string;
				};
				Returns: string;
			};
			get_claim: {
				Args: {
					uid: string;
					claim: string;
				};
				Returns: Json;
			};
			get_claims: {
				Args: {
					uid: string;
				};
				Returns: Json;
			};
			get_my_claim: {
				Args: {
					claim: string;
				};
				Returns: Json;
			};
			get_my_claims: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			is_claims_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			set_claim: {
				Args: {
					uid: string;
					claim: string;
					value: Json;
				};
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
}

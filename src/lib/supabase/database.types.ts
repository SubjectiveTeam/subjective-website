export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			orders: {
				Row: {
					active: boolean | null;
					address: string;
					city: string;
					created_at: string | null;
					id: number;
					postal_code: string;
					products: number[];
					user_id: string | null;
				};
				Insert: {
					active?: boolean | null;
					address: string;
					city: string;
					created_at?: string | null;
					id?: number;
					postal_code: string;
					products: number[];
					user_id?: string | null;
				};
				Update: {
					active?: boolean | null;
					address?: string;
					city?: string;
					created_at?: string | null;
					id?: number;
					postal_code?: string;
					products?: number[];
					user_id?: string | null;
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
					sizes: string[];
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
					sizes: string[];
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
					sizes?: string[];
					stripe_price?: string;
					tags?: string[];
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
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

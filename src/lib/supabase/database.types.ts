export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
	public: {
		Tables: {
			products: {
				Row: {
					active: boolean | null;
					created_at: string | null;
					description: string | null;
					id: number;
					images: string[];
					name: string;
					price: number;
					sizes: string[];
					stripe_id: string | null;
					stripe_price: string;
					tags: string[] | null;
				};
				Insert: {
					active?: boolean | null;
					created_at?: string | null;
					description?: string | null;
					id?: number;
					images?: string[];
					name: string;
					price: number;
					sizes: string[];
					stripe_id?: string | null;
					stripe_price: string;
					tags?: string[] | null;
				};
				Update: {
					active?: boolean | null;
					created_at?: string | null;
					description?: string | null;
					id?: number;
					images?: string[];
					name?: string;
					price?: number;
					sizes?: string[];
					stripe_id?: string | null;
					stripe_price?: string;
					tags?: string[] | null;
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

import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';

declare global {
	namespace App {
		interface Locals {
			consentCookiePresent: boolean;
			supabase: SupabaseClient<Database>;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			consentCookiePresent: boolean;
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}

	type Product = Database['public']['Tables']['products']['Row'];

	type CartItem = {
		product: Product;
		quantity: number;
	};

	type StripeItem = {
		price: string;
		quantity: number;
	};

	type CheckoutResponse = {
		type: 'success' | 'failure';
		url?: string;
	};
}

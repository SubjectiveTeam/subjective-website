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

	interface SearchStoreValue<T extends Record<PropertyKey, any>> {
		data: T[];
		filtered: T[];
		search: string;
	}

	type Product = Database['public']['Tables']['products']['Row'];

	type ProductGroup = Database['public']['Tables']['product_groups']['Row'];

	type ProductGroupDetailed = Omit<
		Database['public']['Views']['product_groups_detailed']['Row'],
		'products'
	> & { products: Product[] };

	type SearchableProduct = ProductGroupDetailed & { searchTerms: string };

	type Order = Database['public']['Tables']['orders']['Row'];

	type OrderProduct = Database['public']['Tables']['order_products']['Row'];

	type OrderWithProducts = Order & { order_products: OrderProduct[] };

	type CartItem = {
		product: Product;
		productGroup: ProductGroup;
		quantity: number;
	};

	type StripeItem = {
		price: string;
		quantity: number;
	};

	type CartItemSimplified = {
		product_id: string;
		quantity: number;
	};

	type CheckoutResponse = {
		type: 'success' | 'failure';
		url?: string;
	};

	type StripeProduct = {
		id: string;
		object: string;
		active: boolean;
		attributes: string[];
		created: number;
		default_price: string;
		description: string;
		images: string[];
		livemode: boolean;
		name: string;
		package_dimensions: {
			height: number;
			width: number;
			length: number;
		};
		tax_code: string;
		type: string;
		unit_label: string;
		updated: number;
		url: string;
	};

	type MessageType = 'success' | 'warning' | 'error' | 'info';
}

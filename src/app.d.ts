import { SupabaseClient, Session } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/database.types';

declare global {
	namespace App {
		interface Locals {
			consentCookiePresent: boolean;
			supabase: SupabaseClient<Database>;
			supabase_service_role: SupabaseClient<Database>;
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

	type Order = Database['public']['Tables']['orders']['Row'];

	type CartItem = {
		product: Product;
		quantity: number;
		size: string;
	};

	type StripeItem = {
		price: string;
		quantity: number;
	};

	type CartItemSimplified = {
		id: string;
		quantity: number;
		size: string;
	}

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
		metadata: {
			tags: string;
			sizes: string;
			price: number;
		};
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

	// {
	// 	id: 'e291fe2f-a9d2-4682-b1ac-3b0e7f2e1f45',
	// 	object: 'product',
	// 	active: false,
	// 	attributes: [],
	// 	created: 1682978680,
	// 	default_price: 'price_1N34poFaTBuMKrTxB92y5ZKd',
	// 	description: '12',
	// 	images: [
	// 	  'https://jkcymtlnxiygulxfzgbf.supabase.co/storage/v1/object/public/product_images/e291fe2f-a9d2-4682-b1ac-3b0e7f2e1f45/test.png'
	// 	],
	// 	livemode: false,
	// 	metadata: { tags: '["test"]', sizes: '["XL"]' },
	// 	name: '12',
	// 	package_dimensions: null,
	// 	shippable: null,
	// 	statement_descriptor: null,
	// 	tax_code: null,
	// 	type: 'service',
	// 	unit_label: null,
	// 	updated: 1682978680,
	// 	url: null
	//   }
}

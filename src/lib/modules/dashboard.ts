import type { SupabaseClient } from '@supabase/supabase-js';
import { fail } from '@sveltejs/kit';
import type Stripe from 'stripe';

export async function updateProduct(formData: FormData, supabase: SupabaseClient, stripe: Stripe) {
	const id: string = formData.get('id') as string;
	const name: string = formData.get('name') as string;
	const description: string = formData.get('description') as string;
	const stock: number = Number(formData.get('stock')) as number;
	const active: boolean = formData.get('active') === 'on' ? true : false;
	const size: string = formData.get('size') as string;

	await stripe.products.update(id, {
		name,
		description,
		active
	});

	const { error } = await supabase
		.from('products')
		.update({
			name,
			description,
			active,
			size,
			stock
		})
		.eq('id', id);

	if (error) {
		return fail(400, { message: 'Something went wrong updating the product in supabase' });
	}

	return {
		success: true
	};
}

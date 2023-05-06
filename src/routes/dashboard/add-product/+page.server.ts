import { stripe } from '$lib/stripe/stripe';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type Stripe from 'stripe';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 } from 'uuid';
import { z } from 'zod';

const addProductSchema = z.object({
	productGroupId: z.string().uuid().nonempty(),
	price: z.number().gt(0).positive().multipleOf(0.01),
	stock: z.number().gte(0).positive().multipleOf(1),
	active: z.boolean(),
	size: z.enum(['XL', 'L', 'M', 'S'])
});

export async function load() {
	const form = await superValidate(addProductSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin)
			return redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const form = await superValidate(request, addProductSchema);

		if (!form.valid) return fail(400, { form });

		const selectProductGroupResponse = await supabase.from('product_groups').select('*').eq('id', form.data.productGroupId).limit(1).single();

		if (!selectProductGroupResponse.data) return fail(400, { form, message: 'Product group does not exist' });

		const productGroup = selectProductGroupResponse.data as ProductGroup;

		const productId = v4();
		const { default_price }: Stripe.Product = await stripe.products.create({
			id: productId,
			name: productGroup.name,
			description: productGroup.name,
			active: form.data.active,
			images: productGroup.images,
			default_price_data: {
				currency: 'EUR',
				// We do times 100 because Stripe uses cents so 1 euro would be 100 cents
				unit_amount: form.data.price * 100
			},
			url: `${url.origin}/products/${productId}`
		});

		const { error } = await supabase.from('products').insert({
			id: productId,
			price: form.data.price,
			stripe_price: default_price as string,
			product_group_id: form.data.productGroupId,
			size: form.data.size,
			stock: form.data.stock,
			active: form.data.active
		})

		if (error) {
			await stripe.products.update(productId, { active: false });
			return fail(400, { form, message: 'Something went wrong inserting the product in supabase' });
		}

		throw redirect(303, '/dashboard?message=Succesfully added product&message_type=success');
	}
};

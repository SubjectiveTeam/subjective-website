import { stripe } from '$lib/server/stripe/stripe';
import { redirectWithMessage } from '$lib/util/util';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateProductSchema = z.object({
	id: z.string().nonempty(),
	stock: z.number().nonnegative().multipleOf(1),
	size: z.enum(['XL', 'L', 'M', 'S']),
	active: z.boolean()
});

export async function load({ url, locals: { supabase } }) {
	const { data } = await supabase
		.from('products')
		.select('*')
		.eq('id', url.searchParams.get('product_id'))
		.limit(1)
		.single();

	if (!data)
		redirectWithMessage(
			303,
			'/dashboard',
			'Cannot edit product because product does not exist',
			'warning'
		);

	const form = await superValidate(data, updateProductSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session?.user.app_metadata.claims_admin)
			redirectWithMessage(303, '/', 'Unauthorized to access this resource', 'error');

		const form = await superValidate(request, updateProductSchema);

		if (!form.valid) return fail(400, { form });

		await stripe.products.update(form.data.id, {
			active: form.data.active
		});

		const { error } = await supabase
			.from('products')
			.update({
				active: form.data.active,
				size: form.data.size,
				stock: form.data.stock
			})
			.eq('id', form.data.id);

		if (error) {
			return fail(400, { form, message: 'Something went wrong updating the product in supabase' });
		}

		redirectWithMessage(303, '/dashboard/products', 'Succesfully updated product', 'success');
	}
};

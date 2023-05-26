import { stripe } from '$lib/server/stripe/stripe';
import { redirect, type Actions, fail } from '@sveltejs/kit';
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
		throw redirect(
			303,
			'/dashboard?message=Cannot edit product because product does not exist&message_type=warning'
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
			return redirect(303, '/?message=Unauthorized to access this resource.&message_type=error');

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

		throw redirect(
			303,
			'/dashboard/products?message=Succesfully updated product&message_type=success'
		);
	}
};

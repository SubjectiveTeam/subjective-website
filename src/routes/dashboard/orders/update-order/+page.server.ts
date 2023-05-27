import { redirectWithMessage } from '$lib/util/util.js';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateOrderSchema = z.object({
	id: z.string().nonempty(),
	address: z.string().nonempty(),
	postal_code: z.string().nonempty(),
	city: z.string().nonempty(),
	status: z.enum(['ORDERED', 'PROCESSED', 'SHIPPED', 'DELIVERED', 'CANCELED'])
});

export async function load({ url, locals: { supabase } }) {
	const { data } = await supabase
		.from('orders')
		.select('*')
		.eq('id', url.searchParams.get('order_id'))
		.limit(1)
		.single();

	if (!data)
		redirectWithMessage(
			303,
			'/dashboard',
			'Cannot edit order because order does not exist',
			'warning'
		);

	const form = await superValidate(data, updateOrderSchema);

	return {
		order: data as Order,
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session?.user.app_metadata.claims_admin)
			redirectWithMessage(303, '/', 'Unauthorized to access this resource', 'error');

		const form = await superValidate(request, updateOrderSchema);

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase
			.from('orders')
			.update({
				address: form.data.address,
				postal_code: form.data.postal_code,
				city: form.data.city,
				status: form.data.status
			})
			.eq('id', form.data.id);

		if (error) {
			return fail(500, { message: 'Something went wrong when updating order' });
		}

		redirectWithMessage(303, '/dashboard/orders', 'Succesfully updated order', 'success');
	}
};

import { redirect, type Actions, fail } from '@sveltejs/kit';
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
		throw redirect(
			303,
			'/dashboard?message=Cannot edit order because order does not exist&message_type=warning'
		);

	const form = await superValidate(data, updateOrderSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session?.user.app_metadata.claims_admin)
			return redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

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

		throw redirect(303, '/dashboard?message=Succesfully updated order&message_type=success');
	}
};

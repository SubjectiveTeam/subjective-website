import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';
import { updateProduct } from '$lib/modules/dashboard';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 } from 'uuid';

export const actions: Actions = {
	updateProduct: async ({ request, locals: { getSession, supabase } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		return await updateProduct(await request.formData(), supabase, stripe);
	},
	updateOrder: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = (await request.formData()) as FormData;
		const id: string = formData.get('id') as string;
		const address: string = formData.get('address') as string;
		const postal_code: string = formData.get('postal-code') as string;
		const city: string = formData.get('city') as string;
		const status: string = formData.get('status') as string;

		const { error } = await supabase
			.from('orders')
			.update({
				address,
				postal_code,
				city,
				status
			})
			.eq('id', id);

		if (error) {
			return fail(500, { message: 'Something went wrong when updating order' });
		}

		return {
			success: true
		};
	}
};

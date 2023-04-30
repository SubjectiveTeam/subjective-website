import type { Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export const actions: Actions = {
	addProduct: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		// TODO Extract data properly
		// TODO Create product using stripe
		// TODO Create product using supabase with info from stripe product (id and images links)
	}
};

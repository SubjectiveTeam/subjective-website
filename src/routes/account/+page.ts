import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase, session } = await parent();

	const { data, error } = await supabase
		.from('orders')
		.select('*')
		.eq('customer_email', session?.user.email);

	if (error) throw redirect(303, '/');

	return {
		orders: data as Order[]
	};
}

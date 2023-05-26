import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('orders').select(`
        *, 
        order_products ( * )
	`);

	if (error) throw redirect(303, '/');

	return {
		ordersWithProducts: data as OrderWithProducts[]
	};
}

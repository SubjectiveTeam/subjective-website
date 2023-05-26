import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('products').select('*');

	if (error) throw redirect(303, '/');

	return {
		products: data as Product[]
	};
}

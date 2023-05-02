import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, params }) => {
	const id = params.id;
	const { supabase } = await parent();

	const { data, error } = await supabase
		.from('products')
		.select('*')
		.eq('id', id)
		.limit(1)
		.single();

	if (error) throw redirect(303, '/');

	return {
		product: data as Product
	};
};

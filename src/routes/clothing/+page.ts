import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('products').select('*').eq('active', true);

	if (error) throw redirect(303, '/');

	return {
		products: data as Product[]
	};
};

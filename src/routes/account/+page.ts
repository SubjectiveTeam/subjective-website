import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('orders').select('*');

	if (error) throw redirect(303, '/');

	return {
		orders: data as Order[]
	};
};

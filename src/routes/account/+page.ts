import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('orders').select('*');

	if (error) throw redirect(303, '/');

	return {
		orders: data as Order[]
	};
};

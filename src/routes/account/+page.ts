import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase, session } = await parent();

	const { data, error } = await supabase.from('orders').select('*').eq('user_id', session?.user.id);

	if (error) throw redirect(303, '/');

	return {
		products: data as Product[]
	};
};

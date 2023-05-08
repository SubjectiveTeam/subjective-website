import { redirect } from '@sveltejs/kit';

export async function load({ url, parent }) {
	const { supabase } = await parent();

	const { data, error } = await supabase.from('store_view').select('*');

	if (error) throw redirect(303, '/');

	return {
		search: url.searchParams.get('search') as string,
		products: data as ProductGroupDetailed[]
	};
}

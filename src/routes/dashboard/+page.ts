import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const { supabase } = await parent();

	const [productRequest, orderRequest] = await Promise.all([
		supabase.from('products').select('*'),
		supabase.from('orders').select('*')
	]);

	if (productRequest.error || orderRequest.error) throw redirect(303, '/');

	return {
		products: productRequest.data as Product[],
		orders: orderRequest.data as Order[],
	};
};

import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase } = await parent();

	const [productRequest, productGroupsRequest, orderRequest] = await Promise.all([
		supabase.from('products').select('*'),
		supabase.from('product_groups').select('*'),
		supabase.from('orders').select(`
			*, 
			order_products ( * )
	  	`)
	]);

	if (productRequest.error || orderRequest.error) throw redirect(303, '/');

	return {
		products: productRequest.data as Product[],
		orderProducts: orderRequest.data as OrderWithProducts[],
		productGroups: productGroupsRequest.data as ProductGroup[]
	};
}

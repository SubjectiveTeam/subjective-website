import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase } = await parent();

	const [productRequest, orderRequest] = await Promise.all([
		supabase.from('products').select('*'),
		supabase
		.from('orders')
		.select(`
			*, 
			order_products ( * )
	  	`)
	]);
	
	if (productRequest.error || orderRequest.error) throw redirect(303, '/');

	return {
		products: productRequest.data as Product[],
		order_products: orderRequest.data as OrderWithProducts[]
	};
}

import { redirectWithMessage } from '$lib/util/util.js';

export async function load({ url, parent }) {
	const { supabase } = await parent();

	const { data, error } = await supabase
		.from('product_groups')
		.select(
			`
	id, 
	name,
	description,
	images,
	products !inner ( * ) 
	`
		)
		.is('products.active', true);

	if (error)
		redirectWithMessage(303, '/', 'Something went wrong while retrieving products.', 'error');

	return {
		search: url.searchParams.get('search') as string,
		products: data as ProductGroupDetailed[]
	};
}

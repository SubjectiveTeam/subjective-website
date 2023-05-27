import { redirectWithMessage } from '$lib/util/util.js';

export async function load({ parent, params }) {
	const { supabase } = await parent();

	const id = params.id;

	const { data, error } = await supabase
		.from('product_groups')
		.select(
			`
	id, 
	name,
	description,
	images,
	products ( * )
  `
		)
		.eq('id', id)
		.is('products.active', true)
		.limit(1)
		.single();

	if (error) redirectWithMessage(303, '/', 'This product does not exist.', 'error');

	return {
		productGroupDetailed: data as ProductGroupDetailed
	};
}

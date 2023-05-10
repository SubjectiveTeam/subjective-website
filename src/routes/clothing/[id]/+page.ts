import { redirect } from '@sveltejs/kit';

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

	if (error) throw redirect(303, '/?message=This product does not exist.&message_type=error');

	return {
		productGroupDetailed: data as ProductGroupDetailed
	};
}

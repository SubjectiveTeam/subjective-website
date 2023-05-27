import { redirectWithMessage } from "$lib/util/util";

export async function load({ locals: { supabase, getSession } }) {
	const session = await getSession();

	const { data, error } = await supabase
		.from('orders')
		.select(
			`
		*, 
		order_products ( * )
  `
		)
		.eq('customer_email', session?.user.email);

	if (error)
		redirectWithMessage(
			303,
			'/account',
			'Something went wrong while retrieving your orders.',
			'error'
		);

	return {
		ordersWithProducts: data as OrderWithProducts[]
	};
}

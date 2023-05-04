import { PUBLIC_BASE_URL } from '$env/static/public';
import { stripe } from '$lib/stripe/stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({
	request,
	locals: { supabase_service_role, getSession }
}) => {
	const data = await request.json();
	const cartItems: CartItem[] = data.items;

	cartItems.forEach(async (cartItem: CartItem) => {
		const { data } = await supabase_service_role
			.from('products')
			.select('*')
			.eq('id', cartItem.product.id)
			.eq('active', true)
			.gte('stock', cartItem.quantity)
			.limit(1)
			.single();

		if (!data) {
			return new Response('One of the products is unavailable.', {
				status: 400
			});
		}
	});

	// Convert products to stripe acceptable objects
	const line_items: StripeItem[] = [];

	const cartItemsSimplified: CartItemSimplified[] = [];

	for (const cartItem of cartItems) {
		line_items.push({
			price: cartItem.product.stripe_price,
			quantity: cartItem.quantity
		});
		cartItemsSimplified.push({
			product_id: cartItem.product.id,
			quantity: cartItem.quantity
		});
	}

	const session = await stripe.checkout.sessions.create({
		customer_email: (await getSession())?.user.email || undefined,
		line_items,
		mode: 'payment',
		success_url: `${PUBLIC_BASE_URL}/success`,
		cancel_url: `${PUBLIC_BASE_URL}/cancel`,
		shipping_address_collection: {
			allowed_countries: ['NL']
		},
		metadata: {
			cartItemsSimplified: JSON.stringify(cartItemsSimplified)
		}
	});

	return new Response(JSON.stringify({ url: session.url }), {
		status: 200,
		headers: {
			'content-type': 'application/json'
		}
	});
};

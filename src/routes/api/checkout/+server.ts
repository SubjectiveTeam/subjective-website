import { stripe } from '$lib/server/stripe/stripe';
import { supabaseServiceRole } from '$lib/server/supabase/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({
	request,
	url,
	locals: { getSession }
}) => {
	const data = await request.json();
	const cartItems: CartItem[] = data.items;

	if (cartItems.length <= 0) {
		return new Response('You must have atleast 1 item inside cart items.', {
			status: 400
		});
	}

	// Convert products to stripe acceptable objects
	const line_items: StripeItem[] = [];

	const cartItemsSimplified: CartItemSimplified[] = [];

	for (const cartItem of cartItems) {
		const { data } = await supabaseServiceRole
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

		// Add line item (for Stripe)
		line_items.push({
			price: cartItem.product.stripe_price,
			quantity: cartItem.quantity
		});

		// Add cart item simplified (for Supabase)
		cartItemsSimplified.push({
			product_id: cartItem.product.id,
			quantity: cartItem.quantity
		});
	}

	const session = await stripe.checkout.sessions.create({
		customer_email: (await getSession())?.user.email || undefined,
		line_items: line_items,
		mode: 'payment',
		success_url: `${url.origin}/success`,
		cancel_url: `${url.origin}/cancel`,
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

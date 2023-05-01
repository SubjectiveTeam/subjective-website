import { stripe } from '$lib/stripe/stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { getSession } }) => {
	const data = await request.json();
	const items: CartItem[] = data.items;
	
	// Convert products to stripe acceptable objects
	const line_items: StripeItem[] = [];

	for (const item of items) {
		line_items.push({
			price: item.product.stripe_price,
			quantity: item.quantity
		});
	}

	const session = await stripe.checkout.sessions.create({
		customer_email: (await getSession())?.user.email || undefined,
		line_items: line_items,
		mode: 'payment',
		success_url: 'http://localhost:5173/success',
		cancel_url: 'http://localhost:5173/cancel'
	});

	return new Response(JSON.stringify({ url: session.url }), {
		status: 200,
		headers: {
			'content-type': 'application/json'
		}
	});
};

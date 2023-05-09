import { stripe } from '$lib/server/stripe/stripe';
import type Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { SECRET_WEBHOOK_KEY } from '$env/static/private';
import { supabaseServiceRole } from '$lib/server/supabase/supabase';

export const POST: RequestHandler = async ({ request }) => {
	const sig = request.headers.get('stripe-signature') as string;

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(await request.text(), sig, SECRET_WEBHOOK_KEY);
	} catch (err) {
		return new Response('Webhook Error', {
			status: 400
		});
	}

	// Handle the event
	switch (event.type) {
		case 'checkout.session.completed': {
			const checkoutSession = event.data.object as Stripe.Checkout.Session;

			if (
				!checkoutSession.metadata ||
				!checkoutSession.shipping_details ||
				!checkoutSession.shipping_details.address
			) {
				return new Response('Missing vital metadata', {
					status: 400
				});
			}

			const { error } = await supabaseServiceRole.rpc('create_order', {
				order_info: {
					address: checkoutSession.shipping_details.address.line1 as string,
					postal_code: checkoutSession.shipping_details.address.postal_code as string,
					city: checkoutSession.shipping_details.address.city as string,
					customer_email: checkoutSession.customer_email as string,
					cart_items: JSON.parse(
						checkoutSession.metadata.cartItemsSimplified
					) as CartItemSimplified[]
				}
			});
			if (error) {
				return new Response('Failed to create order', {
					status: 400
				});
			}
			break;
		}
	}

	return new Response(`Successfully received event: ${event.type}`, {
		status: 200
	});
};

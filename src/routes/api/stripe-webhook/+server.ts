import { stripe } from '$lib/stripe/stripe';
import type Stripe from 'stripe';
import type { RequestHandler } from './$types';
import { SECRET_WEBHOOK_KEY } from '$env/static/private';
import { v4 } from 'uuid';

export const POST: RequestHandler = async ({ request, locals: { supabase_service_role } }) => {
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
			const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session;

			if (!checkoutSessionCompleted.metadata) {
				return new Response('Missing vital parameters: "metadata" to create an order', {
					status: 400
				});
			}

			const order_id = v4();
			const insertOrderResponse = await supabase_service_role.from('orders').insert({
				id: order_id,
				postal_code: checkoutSessionCompleted.shipping_details?.address?.postal_code as string,
				address: checkoutSessionCompleted.shipping_details?.address?.line1 as string,
				city: checkoutSessionCompleted.shipping_details?.address?.city as string,
				status: 'ORDERED',
				customer_email: checkoutSessionCompleted.customer_email as string
			});

			if (insertOrderResponse.error) {
				return new Response(
					'Something went wrong during inserting supabase order. Try again later.',
					{
						status: 400
					}
				);
			}

			const cartItems = JSON.parse(
				checkoutSessionCompleted.metadata.stripeItemsWithSizes
			) as CartItemSimplified[];
			cartItems.forEach(async (cartItemSimplified: CartItemSimplified) => {
				const { error } = await supabase_service_role.from('order_products').insert({
					order_id: order_id,
					product_id: cartItemSimplified.product_id,
					quantity: cartItemSimplified.quantity
				});
				if (error) {
					return new Response(
						'Something went wrong during inserting supabase order products. Try again later.',
						{
							status: 400
						}
					);
				}
			});
			break;
		}
		case 'payment_intent.created': {
			break;
		}
	}

	return new Response(`Successfully received event: ${event.type}`, {
		status: 200
	});
};

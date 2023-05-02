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
			const checkoutSessionCompleted = event.data.object;

			const { error } = await supabase_service_role
			.from('orders')
			.insert({
				id: v4(),
				products: JSON.parse(checkoutSessionCompleted.metadata.items),
				postal_code: checkoutSessionCompleted.shipping_details.address.postal_code,
				address: checkoutSessionCompleted.shipping_details.address.line1,
				city: checkoutSessionCompleted.shipping_details.address.city,
				status: 'ORDERED',
				customer_email: checkoutSessionCompleted.customer_email
			});
			if (error) {
				return new Response(
					'Something went wrong during creating supabase order. Try again later.',
					{
						status: 400
					}
				);
			}
			break;
		}
		case 'payment_intent.created': {
			break;
		}
		case 'product.created': {
			const productCreated: StripeProduct = event.data.object as StripeProduct;

			const { error } = await supabase_service_role.from('products').insert({
				id: productCreated.id,
				stripe_price: productCreated.default_price,
				tags: JSON.parse(productCreated.metadata.tags),
				sizes: JSON.parse(productCreated.metadata.sizes),
				price: productCreated.metadata.price,
				active: productCreated.active,
				name: productCreated.name,
				description: productCreated.description,
				images: productCreated.images
			});
			if (error) {
				return new Response(
					'Something went wrong during creating supabase product. Try again later.',
					{
						status: 400
					}
				);
			}
			break;
		}
		case 'product.updated': {
			const productUpdated: StripeProduct = event.data.object as StripeProduct;

			const { error } = await supabase_service_role
				.from('products')
				.update({
					id: productUpdated.id,
					stripe_price: productUpdated.default_price,
					tags: JSON.parse(productUpdated.metadata.tags),
					sizes: JSON.parse(productUpdated.metadata.sizes),
					price: productUpdated.metadata.price,
					active: productUpdated.active,
					name: productUpdated.name,
					description: productUpdated.description,
					images: productUpdated.images
				})
				.eq('id', productUpdated.id);
			if (error) {
				return new Response(
					'Something went wrong during updating supabase product. Try again later.',
					{
						status: 400
					}
				);
			}
			break;
		}
		default: {
			console.log(`Unhandled event type ${event.type}`);
		}
	}

	return new Response(`Successfully received event: ${event.type}`, {
		status: 200
	});
};

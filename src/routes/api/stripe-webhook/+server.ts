import { stripe } from '$lib/stripe/stripe';
import type Stripe from 'stripe';
import type { RequestHandler } from './$types';

const endpointSecret = 'whsec_16ea878723a7bc1ee0d79fe16f99cb4cd8a458c58643c043d0a95f1e6707fd18';

export const POST: RequestHandler = async ({ request }) => {
    const sig = request.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        // TODO Pass request.body into constructEvent correctly
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        console.log('Request failed');
        console.log(err);
        return new Response('Webhook Error', {
            status: 400
        });
    }
    

    // Handle the event
    switch (event.type) {
        case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case 'checkout.session.expired':
            const checkoutSessionExpired = event.data.object;
            // Then define and call a function to handle the event checkout.session.expired
            break;
        case 'product.created':
            const productCreated = event.data.object;
            console.log("created product");
            
            // Then define and call a function to handle the event product.created
            break;
        case 'product.updated':
            const productUpdated = event.data.object;
            // Then define and call a function to handle the event product.updated
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(null, {
        status: 200
    });
};
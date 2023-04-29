import type { RequestHandler } from "./$types";
import Stripe from 'stripe';
import { SECRET_STRIPE_KEY } from "$env/static/private";
const stripe = new Stripe(SECRET_STRIPE_KEY, { apiVersion: "2022-11-15"});

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const items: CartItem[] = data.items;

    // Convert products to stripe acceptable objects
    const stripeItems: StripeItem[] = [];

    for (const item of items) {
        stripeItems.push(
            {
                price: item.product.stripe_id,
                quantity: item.quantity            
            }
        );
    }
    console.log(stripeItems);

    const session = await stripe.checkout.sessions.create({
        line_items: stripeItems,
        mode: 'payment',
        success_url: 'http://localhost:5173/success',
        cancel_url: 'http://localhost:5173/cancel'
    });

    return new Response(
        JSON.stringify({ url: session.url }),
        {
            status: 200,
            headers: {
                'content-type' : 'application/json'
            }
        }
    );
}


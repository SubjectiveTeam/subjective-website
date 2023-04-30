import type { Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export const actions: Actions = {
    addProduct: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData() as FormData;

        const stripeProduct = await stripe.products.create({
            name: formData.get('name'),
            description: formData.get('description'),
            active: formData.get('active') === 'on' ? true : false,
            default_price_data: {
                currency: 'EUR',
                unit_amount: formData.get('price'),
            }
        });

        const supabaseProduct = (await supabase
        .from('products')
        .insert({ 
            stripe_id: stripeProduct.id,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            active: formData.get('active') === 'on' ? true : false,
            sizes: formData.getAll('sizes') as string[],
            tags: formData.getAll('tags') as string[]
        })).data;

        const images = formData.getAll('images');
        for (let i = 0; i < images.length; i++) {
            const uploadRequest = await supabase.storage
            .from('product_images')
            .upload(`${supabaseProduct.id}/${images[i].name}`, images[i]);
        }

        // TODO Host images in supabase buckets
        // TODO Create product using stripe
        // TODO Create product using supabase with info from stripe product (id and images links)


    }
};

import type { Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export const actions: Actions = {
    addProduct: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData() as FormData;

        console.log(Number(formData.get('price')));
        const name: string = formData.get('name') as string;
        const description: string = formData.get('description') as string;
        const active: boolean =  formData.get('active') === 'on' ? true : false;
        const price: number = Number(Number(formData.get('price')).toFixed(2));
        // TODO CONVERT PRICE TO 2 DECIMAL FLOAT VALUE
    

        const stripeProduct = await stripe.products.create({
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            active: formData.get('active') === 'on' ? true : false,
            default_price_data: {
                currency: 'EUR',
                unit_amount: Number(formData.get('price')),
            }
        });

        console.log(stripeProduct);

        const { data, error } = await supabase
        .from('products')
        .insert({ 
            stripe_id: stripeProduct.default_price as string,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: Number(formData.get('price')),
            active: formData.get('active') === 'on' ? true : false,
            sizes: formData.getAll('sizes') as string[],
            tags: formData.getAll('tags') as string[],
            images: [] as string[]
        });

        if (error || !data) throw Error('Failed to create product');

        const supabaseProduct: Product = data as Product;

        const images = formData.getAll('images') as File[];
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

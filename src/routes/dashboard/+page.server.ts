import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export const actions: Actions = {
    addProduct: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData() as FormData;

        const name: string = formData.get('name') as string;
        const description: string = formData.get('description') as string;
        const active: boolean =  formData.get('active') === 'on' ? true : false;
        const price: number = parseFloat((Math.round(Number(formData.get('price')) * 100) / 100).toFixed(2));
        const sizes: string[] = formData.getAll('sizes') as string[];
        const tags: string[] = formData.getAll('tags') as string[];
        const images: File[] = formData.getAll('images') as File[];

        const stripeProduct = await stripe.products.create({
            name,
            description,
            active,
            default_price_data: {
                currency: 'EUR',
                // We do times 100 because Stripe uses cents so 1 euro would be 100 cents 
                unit_amount: price * 100
            }
        });

        const stripe_id = stripeProduct.default_price as string;

        const { data, error } = await supabase
        .from('products')
        .insert({ 
            stripe_id,
            name,
            description,
            price,
            active,
            sizes,
            tags
        })
        .select()
        .limit(1)
        .single();

        if (error) {
            return fail(500, {
				message: 'Server error. Try again later.'
			});
        }

        const supabaseProduct: Product = data as Product;

        for (let i = 0; i < images.length; i++) {
            const { data, error } = await supabase.storage
            .from('product_images')
            .upload(`${supabaseProduct.id}/${images[i].name}`, images[i]);
        }

        return {
            success: true
        }
    }
};

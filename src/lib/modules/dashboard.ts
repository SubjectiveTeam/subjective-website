import type { SupabaseClient } from "@supabase/supabase-js";
import { fail } from "@sveltejs/kit";
import type Stripe from "stripe";
import { v4 } from "uuid";


export async function addProduct(formData: FormData, supabase: SupabaseClient, stripe: Stripe) {

    const id = v4();
    const name: string = formData.get('name') as string;
    const description: string = formData.get('description') as string;
    const stock: number = Number(formData.get('stock')) as number;
    const active: boolean = formData.get('active') === 'on' ? true : false;
    const price: number = parseFloat(
        (Math.round(Number(formData.get('price')) * 100) / 100).toFixed(2)
    );
    const size: string = formData.get('size') as string;
    const tags: string[] = formData.getAll('tags') as string[];
    const imageFiles: File[] = formData.getAll('images') as File[];

    const images: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
        const { data, error } = await supabase.storage
            .from('product_images')
            .upload(`${id}/${imageFiles[i].name}`, imageFiles[i]);
        if (error) console.error(error.message);
        if (data) images.push(supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl);
    }

    const stripeProduct: Stripe.Product = await stripe.products.create({
        id,
        name,
        description,
        active,
        images,
        default_price_data: {
            currency: 'EUR',
            // We do times 100 because Stripe uses cents so 1 euro would be 100 cents
            unit_amount: price * 100
        },
        metadata: {
            size,
            price,
            tags: JSON.stringify(tags)
        },
        url: `http://localhost:5173/products/${id}`
    });

    const { error } = await supabase.from('products').insert({
        id,
        stripe_price: stripeProduct.default_price as string,
        tags,
        size,
        price,
        active,
        name,
        description,
        stock,
        images
    });

    if (error) {
        await stripe.products.update(id, { active: false })
        return fail(400, { message: 'Something went wrong inserting the product in supabase' });
    }

    return {
        success: true
    };

}

export async function updateProduct(formData: FormData, supabase: SupabaseClient, stripe: Stripe) {

    const id: string = formData.get('id') as string;
    const name: string = formData.get('name') as string;
    const description: string = formData.get('description') as string;
    const stock: number = Number(formData.get('stock')) as number;
    const active: boolean = formData.get('active') === 'on' ? true : false;
    const size: string = formData.get('size') as string;
    const tags: string[] = formData.getAll('tags') as string[];

    await stripe.products.update(id, {
        name,
        description,
        active
    });

    const { error } = await supabase
    .from('products')
    .update({
        name,
        description,
        active,
        size,
        tags,
        stock
    })
    .eq('id', id);

    if (error) {
        return fail(400, { message: 'Something went wrong updating the product in supabase' });
    }

    return {
        success: true
    }
}
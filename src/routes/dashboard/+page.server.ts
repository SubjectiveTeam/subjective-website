import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';

export const actions: Actions = {
	addProduct: async ({ request, locals: { supabase } }) => {
		const formData = (await request.formData()) as FormData;

		const name: string = formData.get('name') as string;
		const description: string = formData.get('description') as string;
		const active: boolean = formData.get('active') === 'on' ? true : false;
		const price: number = parseFloat(
			(Math.round(Number(formData.get('price')) * 100) / 100).toFixed(2)
		);
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

		const stripe_id = stripeProduct.id as string;
		const stripe_price = stripeProduct.default_price as string;

		const supabaseInsertResponse = await supabase
			.from('products')
			.insert({
				stripe_id,
				stripe_price,
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

		if (supabaseInsertResponse.error) {
			return fail(500, {
				message: 'Server error. Try again later.'
			});
		}

		const supabaseProduct: Product = supabaseInsertResponse.data as Product;

		const imageURLs: string[] = [];
		for (let i = 0; i < images.length; i++) {
			const { data, error } = await supabase.storage
				.from('product_images')
				.upload(`${supabaseProduct.id}/${images[i].name}`, images[i]);

			if (error)
				return fail(500, { message: 'There was an error uploading one of the product images' });

			const imageURL = supabase.storage.from('product_images').getPublicUrl(data.path)
				.data.publicUrl;

			imageURLs.push(imageURL);
		}

		const supabaseUpdateReponse = await supabase
			.from('products')
			.update({
				images: imageURLs
			})
			.eq('id', supabaseProduct.id);

		if (supabaseUpdateReponse.error)
			return fail(500, { message: 'There was an error updating the product with your images' });

		await stripe.products.update(stripeProduct.id, {
			images: imageURLs
		});

		return {
			success: true
		};
	},
	deleteProduct: async ({ url, locals: { supabase } }) => {
		const stringifiedProduct: string | null = url.searchParams.get('product');
		if (!stringifiedProduct) return fail(400, { message: 'No product was provided' });
		const product: Product = JSON.parse(stringifiedProduct) as Product;

		const supabaseDeleteResponse = await supabase.from('products').delete().eq('id', product.id);

		if (supabaseDeleteResponse.error)
			return fail(500, { message: 'There was an error deleting product from supabase' });

		const { data, error } = await supabase.storage.from('product_images').list(String(product.id));

		if (error)
			return fail(500, { message: 'There was an error deleting product images from supabase' });

		const paths: string[] = [];
		data.forEach((file) => {
			paths.push(`${product.id}/${file.name}`);
		});
		supabase.storage.from('product_images').remove(paths);

		await stripe.products.update(product.stripe_id as string, {
			active: false
		});

		return {
			success: true
		};
	}
};

import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';
import { v4 } from 'uuid';

export const actions: Actions = {
	addProduct: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized ' });
		}

		const formData = (await request.formData()) as FormData;
		const id = v4();
		const name: string = formData.get('name') as string;
		const description: string = formData.get('description') as string;
		const active: boolean = formData.get('active') === 'on' ? true : false;
		const price: number = parseFloat(
			(Math.round(Number(formData.get('price')) * 100) / 100).toFixed(2)
		);
		const sizes: string[] = formData.getAll('sizes') as string[];
		const tags: string[] = formData.getAll('tags') as string[];
		const files: File[] = formData.getAll('images') as File[];

		const images: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const { data, error } = await supabase.storage
				.from('product_images')
				.upload(`${id}/${files[i].name}`, files[i]);
			if (error)
				return fail(500, { message: `Something went wrong uploading file: ${files[i].name}` });
			images.push(supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl);
		}

		// TODO Add url to product in production
		await stripe.products.create({
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
				sizes: JSON.stringify(sizes),
				tags: JSON.stringify(tags),
				price
			}
		});

		return {
			success: true
		};
	},
	updateProduct: async ({ request, locals: { getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized ' });
		}

		const formData = (await request.formData()) as FormData;
		const id: string = formData.get('id') as string;
		const name: string = formData.get('name') as string;
		const description: string = formData.get('description') as string;
		const active: boolean = formData.get('active') === 'on' ? true : false;
		const sizes: string[] = formData.getAll('sizes') as string[];
		const tags: string[] = formData.getAll('tags') as string[];

		await stripe.products.update(id, {
			name,
			description,
			active,
			metadata: {
				sizes: JSON.stringify(sizes),
				tags: JSON.stringify(tags)
			}
		});

		return {
			success: true
		};
	}
};

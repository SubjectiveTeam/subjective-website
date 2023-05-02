import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';
import { v4 } from 'uuid';

export const actions: Actions = {
	addProduct: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = (await request.formData()) as FormData;
		const id = v4();
		const name: string = formData.get('name') as string;
		const description: string = formData.get('description') as string;
		const active: boolean = formData.get('active') === 'on' ? true : false;
		const price: number = parseFloat(
			(Math.round(Number(formData.get('price')) * 100) / 100).toFixed(2)
		);
		const size: string = formData.get('size') as string;
		const tags: string[] = formData.getAll('tags') as string[];
		const files: File[] = formData.getAll('images') as File[];


		// const { data } = await supabase.from('products').select('*').eq('name', name);
		// if (data) {
		// 	data.forEach(product => {
		// 		if (product.size === size) {
		// 			return fail(400, { message: 'Size already exists for product with same name' });
		// 		}
		// 	});
		// }
		
		const images: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const { data, error } = await supabase.storage
				.from('product_images')
				.upload(`${name}/${v4()}`, files[i]);
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
				size,
				price,
				tags: JSON.stringify(tags)
			}
		});
		
		return {
			success: true
		};
	},
	updateProduct: async ({ request, locals: { getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
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
	},
	updateOrder: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		const formData = (await request.formData()) as FormData;
		const id: string = formData.get('id') as string;
		const address: string = formData.get('address') as string;
		const postal_code: string = formData.get('postal-code') as string;
		const city: string = formData.get('city') as string;
		const status: string = formData.get('status') as string;

		const { error } = await supabase
			.from('orders')
			.update({
				address,
				postal_code,
				city,
				status
			})
			.eq('id', id);

		if (error) {
			return fail(500, { message: 'Something went wrong when updating order' });
		}

		return {
			success: true
		};
	}
};

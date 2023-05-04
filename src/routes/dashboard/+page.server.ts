import { fail, type Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';
import { addProduct, updateProduct } from '$lib/modules/dashboard';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server';

const addProductSchema = z
	.object({
		name: z.string(),
		description: z.string(),
		price: z.number().positive().multipleOf(0.01),
		stockAmount: z.number().gte(0).multipleOf(1),
		active: z.boolean(),
		size: z.string().length(1),
		tags: z.string().array(),
		files: z.instanceof(File).array()
	})
	.superRefine(({ size, files }, ctx) => {
		if (!['XL', 'L', 'M', 'S'].includes(size)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Size must be XL, L, M or S'
			});
		}
		files.forEach((file) => {
			if (!['PNG', 'JPEG', 'JPG', 'GIF'].includes(file.type)) {
				ctx.addIssue({
					code: 'custom',
					message: 'File Type must be PNG, JPEG, JPG or GIF'
				});
			}
		});
	});

const updateProductSchema = z.object({
	name: z.string(),
	description: z.string(),
	stockAmount: z.number().gte(0).multipleOf(1),
	size: z.string().length(1),
	active: z.boolean()
});

export async function load() {
	const addProductForm = await superValidate(addProductSchema, {
		id: 'addProductForm'
	});

	const updateProductForm = await superValidate(updateProductSchema, {
		id: 'updateProductForm'
	});

	return {
		addProductForm,
		updateProductForm
	};
}

export const actions: Actions = {
	addProduct: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		const images: string[] = [];
		for (let i = 0; i < imageFiles.length; i++) {
			const { data, error } = await supabase.storage
				.from('product_images')
				.upload(`${id}/${imageFiles[i].name}`, imageFiles[i]);
			if (error) console.error(error.message);
			if (data)
				images.push(supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl);
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
			await stripe.products.update(id, { active: false });
			return fail(400, { message: 'Something went wrong inserting the product in supabase' });
		}

		return await addProduct(await request.formData(), supabase, stripe);
	},
	updateProduct: async ({ request, locals: { getSession, supabase } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) {
			return fail(401, { message: 'Unauthorized' });
		}

		return await updateProduct(await request.formData(), supabase, stripe);
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

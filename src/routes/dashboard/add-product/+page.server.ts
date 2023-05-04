import { PUBLIC_BASE_URL } from '$env/static/public';
import { stripe } from '$lib/stripe/stripe';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import type Stripe from 'stripe';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 } from 'uuid';
import { z } from 'zod';

const addProductSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().nonempty(),
	price: z.number().gt(0).positive().multipleOf(0.01),
	stock: z.number().gte(0).positive().multipleOf(1),
	active: z.boolean(),
	size: z.enum(['XL', 'L', 'M', 'S'])
});

export async function load() {
	const form = await superValidate(addProductSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin)
			return redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const formData = await request.formData();

		const form = await superValidate(formData, addProductSchema);

		const files = formData.getAll('files') as File[];

		if (!form.valid || files.length <= 0) return fail(400, { form });

		files.forEach((file) => {
			if (['PNG', 'JPEG', 'JPG', 'GIF'].includes(file.type))
				return fail(400, { form, message: 'Files must be of type: PNG, JPEG, JPG or GIF' });
		});

		const id = v4();

		const images: string[] = [];
		for (let i = 0; i < files.length; i++) {
			const { data, error } = await supabase.storage
				.from('product_images')
				.upload(`${id}/${files[i].name}`, files[i]);
			if (error) console.error(error.message);
			if (data)
				images.push(supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl);
		}

		const stripeProduct: Stripe.Product = await stripe.products.create({
			id,
			name: form.data.name,
			description: form.data.description,
			active: form.data.active,
			images,
			default_price_data: {
				currency: 'EUR',
				// We do times 100 because Stripe uses cents so 1 euro would be 100 cents
				unit_amount: form.data.price * 100
			},
			url: `${PUBLIC_BASE_URL}}/products/${id}`
		});

		const { error } = await supabase.from('products').insert({
			id,
			stripe_price: stripeProduct.default_price as string,
			name: form.data.name,
			description: form.data.description,
			price: form.data.price,
			size: form.data.size,
			active: form.data.active,
			stock: form.data.stock,
			images
		});

		if (error) {
			await stripe.products.update(id, { active: false });
			return fail(400, { form, message: 'Something went wrong inserting the product in supabase' });
		}
		throw redirect(303, '/dashboard?message=Succesfully added product&message_type=success');
	}
};

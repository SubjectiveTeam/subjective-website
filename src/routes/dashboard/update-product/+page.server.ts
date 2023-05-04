import { stripe } from '$lib/stripe/stripe';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateProductSchema = z
	.object({
		id: z.string().nonempty(),
		name: z.string().min(1),
		description: z.string().min(1),
		stock: z.number().gte(0).multipleOf(1).min(1),
		size: z.string().length(1),
		active: z.boolean()
	})
	.superRefine(({ size }, ctx) => {
		if (!['XL', 'L', 'M', 'S'].includes(size)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Size must be XL, L, M or S'
			});
		}
	});

export async function load({ url, locals: { supabase }}) {
	const { data } = await supabase.from('products').select('*').eq('id', url.searchParams.get('productID')).limit(1).single();

	if (!data) throw redirect(303, '/dashboard?message=Cannot edit product because product does not exist?messageType=warning');

	const form = await superValidate(data, updateProductSchema);
	
	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {

		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) return redirect(303, '/?message=Unauthorized to access this resource&messageType=error');

		const form = await superValidate(request, updateProductSchema);

		await stripe.products.update(form.data.id, {
			name: form.data.name,
			description: form.data.description,
			active: form.data.active
		});
	
		const { error } = await supabase
			.from('products')
			.update({
				name: form.data.name,
				description: form.data.description,
				active: form.data.active,
				size: form.data.size,
				stock: form.data.stock
			})
			.eq('id', form.data.id);
	
		if (error) {
			return fail(400, { form, message: 'Something went wrong updating the product in supabase' });
		}
		return { form };
	}
};

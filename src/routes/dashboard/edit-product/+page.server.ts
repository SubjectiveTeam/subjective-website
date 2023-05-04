import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const updateProductSchema = z
	.object({
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
	const form = await superValidate(updateProductSchema);

	const product = await supabase.from('products').select('*').eq('id', url.searchParams.get('productID'));

	if (product) throw redirect(303, '/dashboard');

	return {
		form,

	};
}

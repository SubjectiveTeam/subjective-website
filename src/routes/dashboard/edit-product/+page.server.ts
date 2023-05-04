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

export async function load() {
	const form = await superValidate(updateProductSchema);

	return {
		form
	};
}

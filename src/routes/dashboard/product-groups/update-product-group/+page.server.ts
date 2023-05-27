import { stripe } from '$lib/server/stripe/stripe.js';
import { redirectWithMessage } from '$lib/util/util.js';
import { fail, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

const addProductgroupSchema = z.object({
	id: z.string().uuid(),
	name: z.string().nonempty(),
	description: z.string().nonempty(),
	// Files is here to enable tainting on the client, it serves no order purpose
	files: z.any()
});

export async function load({ url, locals: { supabase } }) {
	const { data } = await supabase
		.from('product_groups')
		.select('*')
		.eq('id', url.searchParams.get('product_group_id'))
		.limit(1)
		.single();

	if (!data)
		redirectWithMessage(
			303,
			'/dashboard',
			'Cannot edit product group because product group does not exist',
			'warning'
		);

	const form = await superValidate(data, addProductgroupSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session?.user.app_metadata.claims_admin)
			redirectWithMessage(303, '/', 'Unauthorized to access this resource', 'error');

		const formData = await request.formData();
		const form = await superValidate(formData, addProductgroupSchema);

		if (!form.valid) return fail(400, { form });

		const id = form.data.id;
		const files = formData.getAll('files') as File[];
		const images: string[] = [];

		if (files[0].size > 0) {
			// Ensure all uploaded files are of the correct type
			const invalidFiles = files.filter((file) => !ALLOWED_FILE_TYPES.includes(file.type));
			if (invalidFiles.length > 0) {
				return fail(400, { form, message: 'Files must be of type: ' + ALLOWED_FILE_TYPES });
			}

			// Remove all existing product images to prepare for replacing them
			const productImagesRequest = await supabase.storage.from('product_images').list(id);
			if (productImagesRequest.data) {
				const removePaths = productImagesRequest.data.map((file) => `${id}/${file.name}`);
				await supabase.storage.from('product_images').remove(removePaths);
			}

			// Upload all files and retrieve links for them
			for (const file of files) {
				const uploadRequest = await supabase.storage
					.from('product_images')
					.upload(`${id}/${file.name}`, file);
				if (uploadRequest.error) {
					console.error(uploadRequest.error.message);
				}
				if (uploadRequest.data) {
					images.push(
						supabase.storage.from('product_images').getPublicUrl(uploadRequest.data.path).data
							.publicUrl
					);
				}
			}

			// Update supabase product group
			const updateRequest = await supabase
				.from('product_groups')
				.update({
					name: form.data.name,
					description: form.data.description,
					images
				})
				.eq('id', id);

			if (updateRequest.error) {
				return fail(400, {
					form,
					message: 'Something went wrong during updating product group into supabase.'
				});
			}

			// Update all products on stripe with new images
			const productsRequest = await supabase
				.from('products')
				.select('*')
				.eq('product_group_id', id);
			if (productsRequest.data) {
				for (const product of productsRequest.data) {
					await stripe.products.update(product.id, { images });
				}
			}
		} else {
			// Update supabase product group
			const updateRequest = await supabase
				.from('product_groups')
				.update({
					name: form.data.name,
					description: form.data.description
				})
				.eq('id', id);

			if (updateRequest.error) {
				return fail(400, {
					form,
					message: 'Something went wrong during updating product group into supabase.'
				});
			}
		}

		redirectWithMessage(
			303,
			'/dashboard/product-groups',
			'Succesfully updated product group',
			'success'
		);
	}
};

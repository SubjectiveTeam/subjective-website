import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

const addProductgroupSchema = z.object({
	id: z.string().uuid(),
	name: z.string().nonempty(),
	description: z.string().nonempty()
});

export async function load({ url, locals: { supabase } }) {
	const { data } = await supabase
		.from('product_groups')
		.select('*')
		.eq('id', url.searchParams.get('product_group_id'))
		.limit(1)
		.single();

	if (!data)
		throw redirect(
			303,
			'/dashboard?message=Cannot edit product group because product group does not exist&message_type=warning'
		);

	const form = await superValidate(data, addProductgroupSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin)
			throw redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const formData = await request.formData();

		const form = await superValidate(formData, addProductgroupSchema);

		const files = formData.getAll('files') as File[];

		if (!form.valid) return fail(400, { form });

		if (files[0].size > 0) {
			files.forEach((file) => {
				if (!ALLOWED_FILE_TYPES.includes(file.type))
					return fail(400, { form, message: 'Files must be of type: ' + ALLOWED_FILE_TYPES });
			});

			const { data } = await supabase.storage.from('product_images').list(form.data.id);

			const removePaths: string[] = [];
			data?.forEach((file) => removePaths.push(`${form.data.id}/${file.name}`));
			await supabase.storage.from('product_images').remove(removePaths);

			const images: string[] = [];
			for (const file of files) {
				const { data, error } = await supabase.storage
					.from('product_images')
					.upload(`${form.data.id}/${file.name}`, file);
				if (error) console.error(error.message);
				if (data)
					images.push(
						supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl
					);
			}
			const { error } = await supabase
				.from('product_groups')
				.update({
					name: form.data.name,
					description: form.data.description,
					images
				})
				.eq('id', form.data.id);

			if (error)
				return fail(400, {
					form,
					message: 'Something went wrong during updating product group into supabase.'
				});
		} else {
			const { error } = await supabase
				.from('product_groups')
				.update({
					name: form.data.name,
					description: form.data.description
				})
				.eq('id', form.data.id);

			if (error)
				return fail(400, {
					form,
					message: 'Something went wrong during updating product group into supabase.'
				});
		}

		throw redirect(
			303,
			'/dashboard?message=Succesfully updated product group&message_type=success'
		);
	}
};

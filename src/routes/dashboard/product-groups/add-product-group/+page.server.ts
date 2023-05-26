import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { v4 } from 'uuid';
import { z } from 'zod';

const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];

const addProductgroupSchema = z.object({
	name: z.string().nonempty(),
	description: z.string().nonempty()
});

export async function load() {
	const form = await superValidate(addProductgroupSchema);

	return {
		form
	};
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session?.user.app_metadata.claims_admin)
			throw redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const formData = await request.formData();

		const form = await superValidate(formData, addProductgroupSchema);

		const files = formData.getAll('files') as File[];

		if (!form.valid || files.length <= 0) return fail(400, { form });

		files.forEach((file) => {
			if (!ALLOWED_FILE_TYPES.includes(file.type))
				return fail(400, { form, message: 'Files must be of type: ' + ALLOWED_FILE_TYPES });
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

		const { error } = await supabase.from('product_groups').insert({
			id,
			name: form.data.name,
			description: form.data.description,
			images
		});

		if (error)
			return fail(400, {
				form,
				message: 'Something went wrong during inserting product group into supabase.'
			});

		throw redirect(
			303,
			'/dashboard/product-groups?message=Succesfully added product group&message_type=success'
		);
	}
};

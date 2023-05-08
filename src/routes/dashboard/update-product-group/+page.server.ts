import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

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
			return redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const form = await superValidate(request, addProductgroupSchema);

		if (!form.valid) return fail(400, { form });

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
				message: 'Something went wrong during updaeting product group into supabase.'
			});

		throw redirect(
			303,
			'/dashboard?message=Succesfully updated product group&message_type=success'
		);
	}
};

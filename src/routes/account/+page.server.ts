import { redirect, type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const changePasswordSchema = z
	.object({
		password: z.string().min(8).nonempty(),
		confirmPassword: z.string().min(8).nonempty()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'The passwords do not match'
			});
		}
	});

export async function load({ locals: { supabase, getSession } }) {
	const session = await getSession();

	const form = await superValidate(changePasswordSchema);

	const { data, error } = await supabase
		.from('orders')
		.select(
			`
		*, 
		order_products ( * )
  `
		)
		.eq('customer_email', session?.user.email);

	if (error)
		throw redirect(
			303,
			'/account?message=Something went wrong while retrieving your orders.&message_type=error'
		);

	return {
		form,
		ordersWithProducts: data as OrderWithProducts[]
	};
}

export const actions: Actions = {
	signOut: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/sign-in');
	},
	changePassword: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session)
			return redirect(303, '/?message=Unauthorized to access this resource&message_type=error');

		const form = await superValidate(request, changePasswordSchema);

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.updateUser({
			password: form.data.password
		});

		if (error)
			return fail(400, { form, message: 'Something went wrong while updating your password' });

		return { form, message: 'Successfully updated password' };
	}
};

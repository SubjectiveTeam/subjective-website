import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;
		
		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Password mismatch.'
			});
		}

		const { error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					message: 'Invalid Credentials.',
					values: {
						email
					}
				});
			}
			return fail(500, {
				message: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}
		throw redirect(303, '/sign-in');
	}
};

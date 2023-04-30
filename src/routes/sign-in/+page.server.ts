import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					message: 'Invalid credentials.',
					values: {
						email
					}
				});
			}
			return fail(500, {
				message: error.message,
				values: {
					email
				}
			});
		}
		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo && redirectTo.startsWith('/')) throw redirect(303, redirectTo);
		else throw redirect(303, '/');
	}
};

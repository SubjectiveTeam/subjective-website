import { AuthApiError, type Provider } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const OAUTH_PROVIDERS: string[] = ['google', 'facebook', 'discord'];

const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export async function load() {
	const form = await superValidate(signInSchema);
	return {
		form
	};
}

export const actions: Actions = {
	signIn: async ({ request, url, locals: { supabase } }) => {
		const form = await superValidate(request, signInSchema);

		const provider = url.searchParams.get('provider') as Provider;

		if (provider) {
			if (!OAUTH_PROVIDERS.includes(provider)) {
				return fail(400, { form, message: 'Provider does not exist.' });
			}
			const { data, error } = await supabase.auth.signInWithOAuth({ provider });

			if (error)
				return fail(400, {
					form,
					message: 'Something went wrong while singing you in. Try again later.'
				});

			throw redirect(303, data.url);
		}

		if (!form.valid) return fail(400, { form });

		const { error } = await supabase.auth.signInWithPassword({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, { form, message: 'Invalid Credentials.' });
			}
			return fail(400, { form, message: 'Server Error. Try again later.' });
		}

		const redirectTo = url.searchParams.get('redirectTo');
		if (redirectTo && redirectTo.startsWith('/')) throw redirect(303, redirectTo);
		else throw redirect(303, '/');
	}
};

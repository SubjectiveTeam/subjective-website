import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect} from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';


const signInSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});

export async function load() {
	const form = await superValidate(signInSchema);
	return {
		form
	}
};

export const actions: Actions = {
	default: async ({ request, url, locals: { supabase } }) => {
		const form = await superValidate(request, signInSchema);

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

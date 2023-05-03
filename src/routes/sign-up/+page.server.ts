import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	confirmPassword: z.string().min(8)
})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "The passwords did not match"
			})
		}
	});

export async function load() {
	const form = await superValidate(signUpSchema);
	return {
		form
	}
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const form = await superValidate(request, signUpSchema);

		if (!form.valid) return fail(400, { form, message: form.errors._errors });

		const { error } = await supabase.auth.signUp({
			email: form.data.email,
			password: form.data.password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, { form, message: 'Invalid Credentials.' });
			}
			return fail(400, { form, message: 'Server Error. Try again later.' });
		}
		throw redirect(303, '/sign-in');
	}
};

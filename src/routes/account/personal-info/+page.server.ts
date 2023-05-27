import { redirectWithMessage } from "$lib/util/util";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/client";
import { z } from "zod";

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

export async function load() {

    const form = await superValidate(changePasswordSchema);

    return {
        form,
    };
}

export const actions: Actions = {
	signOut: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/sign-in');
	},
	changePassword: async ({ request, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (!session) redirectWithMessage(303, '/', 'Unauthorized to access this resource', 'error');

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

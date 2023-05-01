import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	signOut: async ({ locals: { supabase } }) => {
		await supabase.auth.signOut();
		throw redirect(303, '/sign-in');
	}
};

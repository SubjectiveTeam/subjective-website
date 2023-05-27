import { redirect } from '@sveltejs/kit';

export async function load() {
	// Dissallow access to the account since no content is there
	throw redirect(303, '/account/personal-info');
}

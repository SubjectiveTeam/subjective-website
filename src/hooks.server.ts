import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

const adminRoutes: string[] = ['/dashboard'];
const authRoutes: string[] = ['/account', '/dashboard'];
const antiAuthRoutes: string[] = ['/sign-in', '/sign-up'];


export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event
	});

	/**
	 * a little helper that is written for convenience so that instead
	 * of calling `const { data: { session } } = await supabase.auth.getSession()`
	 * you just call this `await getSession()`
	 */
	event.locals.getSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		return session;
	};

	// Auth guarding
	const session = await event.locals.getSession();
	const loggedIn: boolean = session !== null;
	const isAdmin: boolean = session?.user.app_metadata.claims_admin;
	const destination: string = event.route.id as string;
	if (!loggedIn && authRoutes.includes(destination)) throw redirect(303, `/sign-in?redirectTo=${destination}`);
	else if (loggedIn && !isAdmin && adminRoutes.includes(destination)) throw redirect(303, '/account');
	else if (loggedIn && antiAuthRoutes.includes(destination)) throw redirect(303, '/account');

	return resolve(event, {
		/**
		 * There´s an issue with `filterSerializedResponseHeaders` not working when using `sequence`
		 *
		 * https://github.com/sveltejs/kit/issues/8061
		 */
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};

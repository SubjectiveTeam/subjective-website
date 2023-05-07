import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Database } from '$lib/supabase/database.types';
import { createSupabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { redirect, type Handle } from '@sveltejs/kit';

const adminRoutes: string[] = [
	'/dashboard',
	'/dashboard',
	'/dashboard/add-product',
	'/dashboard/update-product',
	'/dashboard/add-product-group',
	'/dashboard/update-order'
];
const authRoutes: string[] = [...adminRoutes, '/account'];
const antiAuthRoutes: string[] = ['/sign-in', '/sign-up'];

export const handle: Handle = async ({ event, resolve }) => {
	// Setup supabase client (for user usage)
	event.locals.supabase = createSupabaseServerClient<Database>({
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

	// Route protection
	const session = await event.locals.getSession();
	const loggedIn: boolean = session !== null;
	const isAdmin: boolean = session ? session.user.app_metadata.claims_admin : false;
	const destination: string = event.route.id as string;
	if (!loggedIn && authRoutes.includes(destination))
		throw redirect(
			303,
			`/sign-in?redirectTo=${destination}&message=Unauthorized to access this resource.&message_type=error`
		);
	else if (loggedIn && !isAdmin && adminRoutes.includes(destination))
		throw redirect(
			303,
			'/account?message=Unauthorized to access this resource.&message_type=error'
		);
	else if (loggedIn && antiAuthRoutes.includes(destination))
		throw redirect(303, '/account?message=You are already a logged in user.&message_type=info');

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

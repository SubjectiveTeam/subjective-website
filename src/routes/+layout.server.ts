import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, cookies }) => {
	const consentCookiePresent = cookies.get('cookies-consent') !== undefined;
	return {
		consentCookiePresent,
		session: await getSession()
	};
};

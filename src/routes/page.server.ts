import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    setCookieConsent: async ({ cookies, url }) => {
      const serializedCookieConsent: string | null = url.searchParams.get('cookie');
      if (!serializedCookieConsent) return fail(400, { message: "Action requires cookie of type 'ConsentCookie'" });
      cookies.set('consent', serializedCookieConsent, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
      return {
        success: true
      }
    }
  };
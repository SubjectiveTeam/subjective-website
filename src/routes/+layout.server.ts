import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getSession }, cookies}) => {
  const hasConsentedToCookies = cookies.get('cookies-consent') !==undefined;
  return {
    hasConsentedToCookies,
    session: await getSession()
  };
};
// import { redirect } from '@sveltejs/kit';
// import type { PageLoad } from './$types';

// export const load: PageLoad = async ({ parent, params }) => {
//     const id = params.slug;
//     const { supabase, session } = await parent();
//     const { data, error } = await supabase.from("clothing").eq('id', id) .select("*");
//     if (error) throw redirect(303, '/');
//     return {
//         data
//     }
// }
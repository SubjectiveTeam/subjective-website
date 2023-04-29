import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ parent }) => {
    const { supabase } = await parent();

    const { data, error } = await supabase
    .from('products')
    .select('*');

    if (error) throw redirect(303, '/');
    
    return {
        products: data as Product[]
    }
}
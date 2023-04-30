import type { Actions } from '@sveltejs/kit';
import { stripe } from '$lib/stripe/stripe';
import { convertFormDataToAddProductObject } from '$lib/util/util';

export const actions: Actions = {
    addProduct: async ({ request, locals: { supabase } }) => {
        const formData = await request.formData() as FormData;

        const addProductObject: AddProductObject = convertFormDataToAddProductObject(formData);

        // TODO Extract data properly
        // TODO Host images in supabase buckets
        // TODO Create product using stripe
        // TODO Create product using supabase with info from stripe product (id and images links)


    }
};

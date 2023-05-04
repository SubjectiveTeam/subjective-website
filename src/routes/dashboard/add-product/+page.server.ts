import { fail, type Actions, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { v4 } from "uuid";
import { any, z } from "zod";

const addProductSchema = z
    .object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        price: z.number().gt(0).positive().multipleOf(0.01),
        stock: z.number().gte(0).positive().multipleOf(1),
        active: z.boolean(),
        size: z.string().length(1).nonempty(),
        files: z.instanceof(File)
    })
    .superRefine(({ size, files }, ctx) => {
        if (!['XL', 'L', 'M', 'S'].includes(size)) {
            ctx.addIssue({
                code: 'custom',
                message: 'Size must be XL, L, M or S'
            });
        }
        // files.forEach((file) => {
        //     if (!['PNG', 'JPEG', 'JPG', 'GIF'].includes(file.type)) {
        //         ctx.addIssue({
        //             code: 'custom',
        //             message: 'File Type must be PNG, JPEG, JPG or GIF'
        //         });
        //     }
        // });
    });

export async function load() {
    const form = await superValidate(addProductSchema);
    
    return {
        form,
    };
}

export const actions: Actions = {
	default: async ({ request, locals: { supabase, getSession } }) => {
        const form = await superValidate(request, addProductSchema);

        console.log(form);
        

        if (!form.valid) return fail(400, { form });

        const session = await getSession();

		if (!session || !session.user.app_metadata.claims_admin) return redirect(303, '/');
        
		// const id = v4();

		// const images: string[] = [];
		// for (let i = 0; i < form.files.length; i++) {
		// 	const { data, error } = await supabase.storage
		// 		.from('product_images')
		// 		.upload(`${id}/${imageFiles[i].name}`, imageFiles[i]);
		// 	if (error) console.error(error.message);
		// 	if (data)
		// 		images.push(supabase.storage.from('product_images').getPublicUrl(data.path).data.publicUrl);
		// }

		// const stripeProduct: Stripe.Product = await stripe.products.create({
		// 	id,
		// 	name,
		// 	description,
		// 	active,
		// 	images,
		// 	default_price_data: {
		// 		currency: 'EUR',
		// 		// We do times 100 because Stripe uses cents so 1 euro would be 100 cents
		// 		unit_amount: price * 100
		// 	},
		// 	url: `http://localhost:5173/products/${id}`
		// });

		// const { error } = await supabase.from('products').insert({
		// 	id,
		// 	stripe_price: stripeProduct.default_price as string,
		// 	size,
		// 	price,
		// 	active,
		// 	name,
		// 	description,
		// 	stock,
		// 	images
		// });

		// if (error) {
		// 	await stripe.products.update(id, { active: false });
		// 	return fail(400, { message: 'Something went wrong inserting the product in supabase' });
		// }
        return { form } 
    }
};
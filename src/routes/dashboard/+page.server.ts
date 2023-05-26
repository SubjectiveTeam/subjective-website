import { redirect } from "@sveltejs/kit";

export async function load() {
    // Dissallow access to the dashboard since no content is there
    throw redirect(303, '/dashboard/products');
}
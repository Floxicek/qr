// src/routes/+page.ts
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = () => {
    // This will throw the redirect before the page even renders
    throw redirect(302, `${base}/v1/docs`); 
};
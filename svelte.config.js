import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			fallback: '404.html' // Helps with direct link navigation
		}),
		paths: {
			// If we are in dev mode, use empty string.
			// If we are building for production, use the env variable '/qr'
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};

export default config;
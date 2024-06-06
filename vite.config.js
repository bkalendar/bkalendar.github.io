import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: 'esnext',
		minify: false,
		sourcemap: true
	},
	plugins: [sveltekit()]
};

export default config;

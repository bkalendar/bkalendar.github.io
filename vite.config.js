import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
	build: {
		target: 'esnext'
	},
	plugins: [sveltekit()]
};

export default config;

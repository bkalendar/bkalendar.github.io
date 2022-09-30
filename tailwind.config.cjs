const colors = require('tailwindcss/colors');

/** @type {import("tailwindcss").Config} */
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		fontFamily: {
			body: ['Arimo', 'sans-serif'],
			display: ['Maitree', 'serif'],
			mono: ['monospace']
		},
		colors: {
			marine: {
				100: '#e6eaf4',
				300: '#415fae',
				500: '#022a93',
				700: '#01154a',
				900: '#00081d'
			},
			sky: {
				100: '#e8f3fb',
				300: '#8ac4ed',
				500: '#1488DB',
				700: '#083658',
				900: '#031421'
			},
			rose: {
				100: '#f0d9e0',
				300: '#bd597a',
				500: '#990033',
				700: '#54001c',
				900: '#170008'
			},
			green: colors.green,
			slate: colors.slate,
			transparent: colors.transparent
		}
	},

	plugins: [require('@tailwindcss/line-clamp')]
};

module.exports = config;

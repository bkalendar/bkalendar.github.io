const colors = require('tailwindcss/colors');

const config = {
  mode: 'jit',
  darkMode: 'media',
  purge: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    colors: {
      transparent: 'transparent',
      currentColor: 'currentColor',
      white: colors.white,
      gray: colors.coolGray,
      blue: {
        DEFAULT: '#1488db',
        deep: '#032b91',
      },
    },
    extend: {
      fontFamily: {
        serif: ['Crimson Pro', 'serif'],
        sans: ['Be Vietnam Pro', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

module.exports = config;

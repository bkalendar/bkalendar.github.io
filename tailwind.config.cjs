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
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
      animation: {
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
    },
  },
  plugins: [],
};

module.exports = config;

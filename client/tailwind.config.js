/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], // ✅ use 'content' not 'purge' if you're using Tailwind v3+
  theme: {
    extend: {
      colors: {
        primary: '#eb3b88',
        secondary: '#523d97',
        yellow: '#FECB19',
      },
    },
  },
  plugins: [],
};

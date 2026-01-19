/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'red-600': '#dc2626',
        'red-700': '#b91c1c',
      },
    },
  },
  plugins: [],
}



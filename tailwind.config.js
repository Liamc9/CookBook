/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: [],
  theme: {
      extend: {
        colors: {
          'custom-brown': '#A17954',  // Custom name and hex color
        }
      },
  },
  plugins: [],
}

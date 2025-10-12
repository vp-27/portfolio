/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rh-green': '#00C805',
        'rh-dark': '#0F0F0F',
        'rh-gray': '#2D2D2D',
        'rh-light-gray': '#3D3D3D',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        panel: { DEFAULT: '#0f172a', accent: '#c9a227' }
      }
    },
  },
  plugins: [],
}

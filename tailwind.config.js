/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poly: "Poly, sans-serif",
        "dm-sans": "DM Sans, sans-serif",
      },
    },
  },
  plugins: [],
};

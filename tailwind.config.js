/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        "brand-primary": "#4D21FF", // Used for primary actions, links, and highlights
        "brand-accent": "#21D4FF", // Used for secondary accents and highlights

        // Surface colors
        "surface-dark": "#101428", // Used for dark backgrounds

        // Existing colors
        "primary-black": "#013237",
        "primary-gray": "#00000066",
        "primary-light-blue": "#E6EAFF",
        "primary-dark-blue": "#000625",
      },
    },
  },
  plugins: [],
};

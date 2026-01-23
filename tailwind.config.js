/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
       colors: {
      'primary-black': '#013237',
      'primary-gray': '#00000066',
      'primary-light-blue': '#E6EAFF',
      'primary-dark-blue': '#000625',
    },
    },
  },
  plugins: [],
};

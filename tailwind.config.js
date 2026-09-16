/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './.storybook/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f4ff',
          100: '#e6e9fe',
          200: '#c3caf9',
          300: '#9fa9f3',
          400: '#7b88ec',
          500: '#5766e0',
          600: '#4351c2',
          700: '#333e97',
          800: '#252c6b',
          900: '#171b40',
        },
        danger: {
          500: '#e0575e',
          600: '#c23f46',
        },
      },
    },
  },
  plugins: [],
};

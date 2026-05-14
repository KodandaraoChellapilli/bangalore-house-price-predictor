/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cyan: '#22d3ee',
          violet: '#8b5cf6',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}


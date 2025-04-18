/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          light: '#f3c6bd',
          DEFAULT: '#e67e5a',
          dark: '#c34a23',
        },
        'secondary': {
          light: '#b7cadb',
          DEFAULT: '#5a87b1',
          dark: '#2c5a87',
        },
        'neutral': {
          light: '#f4f1ed',
          DEFAULT: '#e6dfd7',
          dark: '#a1968c',
        },
      },
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'serif': ['Playfair Display', 'ui-serif', 'Georgia'],
      },
    },
  },
  plugins: [],
} 
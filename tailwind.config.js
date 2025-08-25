/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Agregamos los colores que queremos usar para el degradado
        orange: colors.orange,
        red: colors.red,
      },
    },
  },
  plugins: [],
};
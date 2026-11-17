/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Escala de fuente ampliada (antes xs = 12 px, sm = 14 px): mínimo 14 px, texto de cuerpo 16 px.
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['1rem', { lineHeight: '1.5rem' }],
      },
      colors: {
        'unal-verde': '#94B43B',
        'unal-rojo': '#A61C31',
        'unal-verde-oscuro': '#466B3F',
        'unal-vino': '#76232F',
        'unal-gris-oscuro': '#565A5C',
        'unal-gris-claro': '#B1B2B0',
        'unal-fondo': '#F4F4F3',
        'unal-texto': '#1F2224',
        'unal-header': '#4D4D4D',
        'unal-header-oscuro': '#3E3E3E',
        'unal-footer': '#5F5F5F',
      },
      fontFamily: {
        sans: ['"Ancizar Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '4px', md: '4px', lg: '6px' },
    },
  },
  plugins: [],
}

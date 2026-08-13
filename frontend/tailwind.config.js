/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        deleon: {
          dark: '#0A2F1C',
          gold: '#D4AF37',
          ivory: '#FFFFF0',
          charcoal: '#1A1A1A'
        },
        syden: {
          sage: '#87A878',
          terracotta: '#E2725B',
          cream: '#FFFDD0',
          slate: '#2F4F4F'
        },
        deefresh: {
          red: '#FF6347',
          yellow: '#FFD700',
          mint: '#F5FFFA',
          plum: '#673147'
        }
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        lato: ['Lato', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif']
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      }
    }
  },
  plugins: []
}

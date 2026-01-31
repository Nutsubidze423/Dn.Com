/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        textPrimary: '#FFFFFF',
        textSecondary: '#999999',
        accentGold: '#D4AF37',
        border: '#1a1a1a',
        darkGray: '#333333',
        mediumGray: '#666666',
        lightGray: '#cccccc'
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-delay': 'fadeIn 0.8s ease-out 0.4s both',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        bounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' }
        }
      }
    },
  },
  plugins: [],
}

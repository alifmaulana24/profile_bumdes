/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bumdes: {
          50:  '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#43A047',
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#145218',
          accent: '#8BC34A',
        }
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['"Fira Code"', 'Courier New', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.3s ease-out forwards',
        'slide-out-right': 'slideOutRight 0.3s ease-in forwards',
        'counter': 'counter 2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #388E3C 70%, #43A047 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(27,94,32,0.8) 100%)',
      },
      boxShadow: {
        'bumdes': '0 4px 20px rgba(46, 125, 50, 0.2)',
        'bumdes-lg': '0 8px 40px rgba(46, 125, 50, 0.3)',
      },
    },
  },
  plugins: [],
}

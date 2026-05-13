/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        noir: {
          DEFAULT: '#0a0a0a',
          50: '#e0e0e0',
          100: '#c0c0c0',
          200: '#a0a0a0',
          300: '#808080',
          400: '#606060',
          500: '#404040',
          600: '#2a2a2a',
          700: '#1a1a1a',
          800: '#111111',
          900: '#0a0a0a',
        },
        amber: {
          DEFAULT: '#c8a44e',
          light: '#e8c97a',
          pale: '#f5e6c8',
        },
        sage: {
          DEFAULT: '#7a8a6e',
          light: '#a0b090',
        },
      },
      animation: {
        'fade-in': 'fadeIn 3s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
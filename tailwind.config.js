/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ember: '#D93A2B',
        amberx: '#E8B04B',
        day: '#FAF8F4',
        dusk: '#F0EDE6',
        night: '#2A2724',
        deepnight: '#1A1816',
        dawn: '#3A3530',
        ink: '#211D19',
        paper: '#F4F1EA',
      },
      fontFamily: {
        sans: [
          '"Geist Sans"',
          'Geist',
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      transitionTimingFunction: {
        mass: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

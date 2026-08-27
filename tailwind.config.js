/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { xs: '480px' },
      colors: {
        ground: '#FAF8F4',
        ink: '#111111',
        green: '#1F6F4A',
        greenlite: '#4FAF7E',
        ember: '#D93A2B',
        muted: '#8A857E',
        bubble: '#E9E9EB',
        dusk: '#F0EDE6',
        night: '#2A2724',
        deepnight: '#1A1816',
        dawn: '#3A3530',
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

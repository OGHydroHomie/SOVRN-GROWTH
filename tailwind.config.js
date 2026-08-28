/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { xs: '480px' },
      colors: {
        ground: '#FAF8F4',
        ink: '#111111',
        charcoal: '#1C1A18',
        green: '#1F6F4A',
        sms: '#34C759',
        muted: '#8A857E',
        bubble: '#E9E9EB',
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

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#1e1f22',
          secondary: '#2b2d31',
          tertiary: '#313338',
        },
        accent: {
          primary: '#5865f2',
          success: '#57f287',
          warning: '#fee75c',
          danger: '#ed4245',
          available: '#3ba55c',
          busy: '#ed4245',
          sleeping: '#5865f2',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b5bac1',
          muted: '#949ba4',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
};
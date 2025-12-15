import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        accent: {
          DEFAULT: '#0071e3',
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b8ddff',
          300: '#7cc2ff',
          400: '#36a3ff',
          500: '#0d87ff',
          600: '#0071e3',
          700: '#0057b8',
          800: '#004a96',
          900: '#003f7a',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'display': ['80px', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-sm': ['56px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline': ['48px', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'headline-sm': ['32px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'title': ['28px', { lineHeight: '1.2' }],
        'title-sm': ['24px', { lineHeight: '1.25' }],
        'body': ['17px', { lineHeight: '1.47' }],
        'body-sm': ['14px', { lineHeight: '1.43' }],
      },
    },
  },
  plugins: [],
}
export default config


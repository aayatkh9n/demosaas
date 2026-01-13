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
        'chinese': {
          primary: '#DC2626',
          dark: '#1F1F1F',
          accent: '#000000',
        },
        'biryani': {
          primary: '#B8860B',
          dark: '#8B4513',
          accent: '#D4A574',
        },
      },
    },
  },
  plugins: [],
}
export default config


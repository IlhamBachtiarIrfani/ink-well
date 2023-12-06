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
        'surface': '#F4F6F6',
      },
      boxShadow: {
        'custom': '-6px 12px 0 0 rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

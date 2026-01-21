import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0a0c0f',
          secondary: '#0f1218',
          tertiary: '#161a22',
          card: '#1a1f2a',
          hover: '#232a38',
        },
        border: {
          DEFAULT: '#2a3040',
          bright: '#3d4760',
        },
        text: {
          DEFAULT: '#e8eaed',
          muted: '#8b919e',
          dim: '#5a6070',
        },
        gold: {
          DEFAULT: '#d4a84b',
          bright: '#e4bc5e',
          dim: 'rgba(212, 168, 75, 0.12)',
        },
        navy: {
          DEFAULT: '#1a365d',
          bright: '#2c5282',
        },
        status: {
          green: '#22c55e',
          'green-dim': 'rgba(34, 197, 94, 0.12)',
          blue: '#3b82f6',
          'blue-dim': 'rgba(59, 130, 246, 0.12)',
          red: '#ef4444',
          'red-dim': 'rgba(239, 68, 68, 0.12)',
          amber: '#f59e0b',
          'amber-dim': 'rgba(245, 158, 11, 0.12)',
        },
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config

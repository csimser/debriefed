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
        // Original hardcoded palette (still usable for non-themed elements like resume templates)
        bg: {
          primary: 'var(--color-background)',
          secondary: 'var(--color-muted)',
          tertiary: 'var(--color-sidebar-tertiary)',
          card: 'var(--color-card)',
          hover: 'var(--color-hover)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          bright: 'var(--color-border-bright)',
        },
        text: {
          DEFAULT: 'var(--color-foreground)',
          muted: 'var(--color-muted-foreground)',
          dim: 'var(--color-text-dim)',
        },
        gold: {
          DEFAULT: 'var(--color-primary)',
          bright: 'var(--color-primary-hover)',
          dim: 'var(--color-primary-dim)',
        },
        navy: {
          DEFAULT: 'var(--color-secondary)',
          bright: 'var(--color-secondary-hover)',
        },
        status: {
          green: 'var(--color-success)',
          'green-dim': 'var(--color-success-dim)',
          blue: 'var(--color-info)',
          'blue-dim': 'var(--color-info-dim)',
          red: 'var(--color-destructive)',
          'red-dim': 'var(--color-destructive-dim)',
          amber: 'var(--color-warning)',
          'amber-dim': 'var(--color-warning-dim)',
        },
        // Theme-specific tokens
        't-sidebar': 'var(--color-sidebar)',
        't-sidebar-fg': 'var(--color-sidebar-foreground)',
        't-input': 'var(--color-input)',
        't-input-border': 'var(--color-input-border)',
        't-input-focus': 'var(--color-input-focus)',
        't-section-accent': 'var(--color-section-accent)',
        't-info-bg': 'var(--color-info-bg)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
        nav: ['var(--font-nav)'],
      },
    },
  },
  plugins: [],
}
export default config

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--theme-page) / <alpha-value>)',
        surface: 'rgb(var(--theme-surface) / <alpha-value>)',
        muted: 'rgb(var(--theme-muted) / <alpha-value>)',
        ink: 'rgb(var(--theme-ink) / <alpha-value>)',
        body: 'rgb(var(--theme-body) / <alpha-value>)',
        soft: 'rgb(var(--theme-soft) / <alpha-value>)',
        line: 'rgb(var(--theme-line) / <alpha-value>)',
        accent: 'rgb(var(--theme-accent) / <alpha-value>)',
        secondary: 'rgb(var(--theme-secondary) / <alpha-value>)',
        warm: 'rgb(var(--theme-warm) / <alpha-value>)',
        attention: 'rgb(var(--theme-attention) / <alpha-value>)',
      },
      maxWidth: {
        content: '76rem',
      },
    },
  },
  plugins: [],
};

export default config;

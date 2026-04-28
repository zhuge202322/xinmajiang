import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F0',
        cream2: '#FAF1E0',
        wine: {
          DEFAULT: 'rgb(var(--wine) / <alpha-value>)',
          dark: 'rgb(var(--wine-dark) / <alpha-value>)',
          deeper: 'rgb(var(--wine-deeper) / <alpha-value>)',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#E8C766',
          soft: '#F5E5B8',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sc)', 'Noto Sans SC', 'sans-serif'],
        serif: ['var(--font-noto-serif-sc)', 'Noto Serif SC', 'serif'],
      },
      backgroundImage: {
        'diamond-pattern':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'><g fill='none' stroke='%23D4AF37' stroke-width='0.6' opacity='0.35'><path d='M30 0 L60 30 L30 60 L0 30 Z'/><path d='M30 10 L50 30 L30 50 L10 30 Z'/></g></svg>\")",
      },
      boxShadow: {
        card: '0 6px 24px rgba(90, 64, 128, 0.10)',
        gold: '0 0 0 1px #D4AF37, 0 8px 24px rgba(212, 175, 55, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;

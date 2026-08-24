import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090D',
        panel: '#11131A',
        border: 'rgba(255,255,255,0.12)',
        accent: '#6ee7ff',
        violet: '#8b5cf6',
      },
      boxShadow: {
        glow: '0 0 30px rgba(110, 231, 255, 0.2)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;

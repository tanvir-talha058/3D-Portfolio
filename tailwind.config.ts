import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05060D',
        panel: '#0F1220',
        border: 'rgba(190,215,255,0.14)',
        accent: '#6fd6ee',
        violet: '#8d7bf2',
      },
      boxShadow: {
        glow: '0 0 30px rgba(111, 214, 238, 0.24)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(190,215,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(190,215,255,0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;

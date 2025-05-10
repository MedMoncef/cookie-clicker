import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cookie: {
          light: '#f9d6a5',
          DEFAULT: '#c87941',
          dark: '#8b4513',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float-up 1s forwards',
        'pulse-slow': 'pulse 3s infinite',
      },
      boxShadow: {
        'cookie': '0 0 15px rgba(200, 121, 65, 0.7)',
      },
    },
  },
  plugins: [],
};

export default config;

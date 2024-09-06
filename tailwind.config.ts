import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        xx_sm: '375px',
        x_sm: '480px',
        sm: '576px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      colors: {
        primary: "#a81e2e",
        secondary: "#17396d",
      },
      fontSize: {
        xs: [
          '1.2rem', { lineHeight: '1.6rem' }
        ],
        sm: [
          '1.4rem', { lineHeight: '2rem' }
        ],
        base: [
          '1.6rem', { lineHeight: '2.4rem' }
        ],
        lg: [
          '1.8rem', { lineHeight: '2.8rem' }
        ],
        xl: [
          '2rem', { lineHeight: '2.8rem' }
        ],
        '2xl': [
          '2.4rem', { lineHeight: '3.2rem' }
        ],
        '3xl': [
          '3rem', { lineHeight: '3.6rem' }
        ],
        '4xl': [
          '3.6rem', { lineHeight: '4rem' }
        ],
        '5xl': [
          '4.8rem', { lineHeight: '4.8rem' }
        ],
      },
      spacing: {
        "0": ".0rem",
        "px": ".1rem",
        "0.5": ".2rem",
        "1": ".4rem",
        "1.5": ".6rem",
        "2": ".8rem",
        "2.5": "1rem",
        "3": "1.2rem",
        "3.5": "1.4rem",
        "4": "1.6rem",
        "5": "2.0rem",
        "6": "2.4rem",
        "7": "2.8rem",
        "8": "3.2rem",
        "9": "3.6rem",
        "10": "4.0rem",
        "11": "4.4rem",
        "12": "4.8rem",
        "14": "5.6rem",
        "16": "6.4rem",
        "20": "8.0rem",
        "24": "9.6rem",
        "28": "11.2rem",
        "32": "12.8rem",
        "36": "14.4rem",
        "40": "16.0rem",
        "44": "17.6rem",
        "48": "19.2rem",
        "52": "20.8rem",
        "56": "22.4rem",
        "60": "24.0rem",
        "64": "25.6rem",
        "72": "28.8rem",
        "80": "32.0rem",
        "96": "38.4rem",
      }
    },
  },
  plugins: [],
};
export default config;

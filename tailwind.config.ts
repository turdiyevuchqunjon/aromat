import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C97A",
          dark: "#9C7C33",
        },
        ink: {
          DEFAULT: "#0B0B0C",
          soft: "#151517",
          line: "#232326",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-radial":
          "radial-gradient(60% 60% at 50% 30%, rgba(201,162,75,0.25) 0%, rgba(11,11,12,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;

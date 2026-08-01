import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12211C",
        paper: "#F5F6F0",
        jade: "#1F6F5C",
        jadeDeep: "#164E41",
        coral: "#FF6F59",
        sand: "#E7E4D8",
        mist: "#8FA39B",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;

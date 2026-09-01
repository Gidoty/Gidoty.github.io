import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep forest green + warm industrial neutrals — evokes the
        // environmental-monitoring / methane-reduction space this project
        // sits in, rather than a generic corporate teal.
        ink: "#13201A",
        brand: {
          50: "#EAF3EA",
          100: "#CFE3CE",
          400: "#3F7A4C",
          500: "#2C6B3B",
          600: "#1F4F2C",
          700: "#163A20",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

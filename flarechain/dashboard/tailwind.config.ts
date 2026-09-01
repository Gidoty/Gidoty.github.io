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
        // Deeper canopy tones for the hero backdrop — a dusk-in-the-forest
        // gradient, not just a flat brand color block.
        canopy: {
          900: "#0A1B12",
          800: "#12301F",
          700: "#1B4128",
        },
        // Dappled-sunlight accent, used sparingly (hero glow, one hairline
        // rule) — never as a second competing brand color.
        gold: {
          300: "#F2D9A0",
          400: "#E8C476",
          500: "#D9A94A",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

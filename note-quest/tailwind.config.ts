import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: "#0D0D0F",
        parchment: "#FAF7F2",
        gold: "#F5C842",
        "gold-dark": "#C49A0C",
        coral: "#FF6B5B",
        sage: "#4CAF7D",
        sky: "#4A9EFF",
        violet: "#9B6DFF",
        mist: "#E8E4DC",
      },
      animation: {
        "bounce-in": "bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-ring": "pulseRing 1s ease-out infinite",
        "shake": "shake 0.4s ease-in-out",
        "pop": "pop 0.2s ease-out",
        "timer-drain": "timerDrain linear forwards",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(1.4)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-8px)" },
          "40%": { transform: "translateX(8px)" },
          "60%": { transform: "translateX(-5px)" },
          "80%": { transform: "translateX(5px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        timerDrain: {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

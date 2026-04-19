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
        "pulse-ring": "pulseRing 0.8s ease-out forwards",
        "shake": "shake 0.35s ease-in-out",
        "pop": "pop 0.25s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        // Streak flame animations
        "flame-flicker": "flameFlicker 0.8s ease-in-out infinite alternate",
        "flame-burst": "flameBurst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        // Timer pulse when low
        "timer-pulse": "timerPulse 0.5s ease-in-out infinite",
      },
      keyframes: {
        bounceIn: {
          "0%": { transform: "scale(0.7)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
        pop: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        flameFlicker: {
          "0%": { transform: "scaleY(1) scaleX(1)", filter: "brightness(1)" },
          "100%": { transform: "scaleY(1.08) scaleX(0.95)", filter: "brightness(1.2)" },
        },
        flameBurst: {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        timerPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

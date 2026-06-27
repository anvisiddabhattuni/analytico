/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        sans: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#08070b",
          light: "#121119",
          card: "#15131c",
        },
      },
      backgroundImage: {
        "glow-orange":
          "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(239,68,68,0.30), transparent 50%), radial-gradient(circle at 50% 100%, rgba(124,45,18,0.45), transparent 55%)",
        "accent-gradient": "linear-gradient(135deg, #fb923c 0%, #f97316 45%, #ef4444 100%)",
        "card-sheen": "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(249,115,22,0.55)",
        "glow-sm": "0 0 30px -10px rgba(249,115,22,0.5)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
}
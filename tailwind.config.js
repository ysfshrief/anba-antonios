/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5EFE1",
        sand: "#E4D5B7",
        stone: "#8B6F47",
        desert: "#3E2C1C",
        burgundy: "#6B1F2A",
        gold: "#B08D3E",
        goldlight: "#D8B968",
        ink: "#2A1D12",
      },
      fontFamily: {
        display: ['Amiri', 'serif'],
        body: ['Tajawal', 'sans-serif'],
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(62, 44, 28, 0.45)",
        soft: "0 10px 30px -12px rgba(62, 44, 28, 0.35)",
        glow: "0 0 40px -8px rgba(176, 141, 62, 0.55)",
      },
      keyframes: {
        floatCross: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)", opacity: "0.06" },
          "50%": { transform: "translateY(-30px) rotate(4deg)", opacity: "0.12" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "45%": { opacity: "0.86" },
          "55%": { opacity: "0.94" },
        },
      },
      animation: {
        floatCross: "floatCross 14s ease-in-out infinite",
        fadeUp: "fadeUp 0.9s ease forwards",
        shimmer: "shimmer 1.8s linear infinite",
        flicker: "flicker 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F7F1E4",
        cream: "#FBF6EC",
        sand: "#E8D9BC",
        stone: "#9A7B4F",
        desert: "#4A3521",
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
        card: "0 18px 40px -20px rgba(62,44,28,0.4)",
        soft: "0 8px 24px -12px rgba(62,44,28,0.3)",
        glow: "0 0 36px -8px rgba(176,141,62,0.5)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity:"0", transform:"translateY(24px)" }, "100%": { opacity:"1", transform:"translateY(0)" } },
        pulseGold: { "0%,100%": { boxShadow:"0 0 0 0 rgba(176,141,62,0.5)" }, "50%": { boxShadow:"0 0 0 12px rgba(176,141,62,0)" } },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease forwards",
        pulseGold: "pulseGold 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

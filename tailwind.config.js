export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#f0825c",
          hover: "#d96b3f",
          dark: "#e06a45",
          soft: "#fff4ed",
          muted: "#fde8dc",
        },
        dark: {
          bg: "#0f172a",
          surface: "#1e293b",
          surface2: "#334155",
          border: "#475569",
          text: "#e2e8f0",
          muted: "#94a3b8",
          brand: "#ff9f7a",
          brandSoft: "#4a2b22",
        },
      },
    },
  },
  plugins: [],
};

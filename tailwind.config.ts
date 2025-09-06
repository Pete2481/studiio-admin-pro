import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      width: {
        '68': '17rem', // 272px for expanded sidebar
      },
      margin: {
        '68': '17rem', // 272px for page margin when sidebar is expanded
      },
      colors: {
        brand: {
          text: "#111827",
          bg: "#f8fafc",
          card: "#ffffff",
          border: "#e5e7eb",
          muted: "#64748b",
          accent: "#e9f9f0",
          accentHover: "#d3f2e1",
          accentActive: "#b7e7cc",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;

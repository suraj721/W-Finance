/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D9FF00", // Neon Lime
        secondary: "#00D1FF", // Cyan
        accent: "#FF5C00", // Orange
        dark: {
          900: "#0D0D0D", // Deep Black
          800: "#161616", // Card Black
          700: "#222222", // Lighter Black (border)
        },
        slate: {
          ...require('tailwindcss/colors').slate,
          800: "#161616", // Override slate 800 for cards if needed by components
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],

};

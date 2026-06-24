/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        axon: {
          bg: "#000000",
          card: "#0a0a0a",
          cardHigh: "#121212",
          border: "#262626",
          borderSubtle: "#1a1a1a",
          borderActive: "#404040",
          text: "#ffffff",
          textSecondary: "#a3a3a3",
          textMuted: "#525252",
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

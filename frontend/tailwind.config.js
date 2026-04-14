/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF7D44',
        darkBg: '#0F1115',
        cardBg: '#1C1F26',
        accent: '#2D3139',
      },
      animation: {
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'slideRight': 'slideRight 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}
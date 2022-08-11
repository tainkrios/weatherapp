/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "weather-primary":"#00668a",
        "weather-secondary":"#004e71"
      }
    },
    fontFamily: {
      Jakarta: ['Plus Jakarta Sans, sans-serif']
    },
    container: {
      padding: '2rem',
      center: true
    },
    screen: {
      sm: '640px',
      md: '768px'
    }
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        twitterWhite: '#e7e9ea',
        twitterBlue: '#1d9bf0',
        twitterBorder: '#2f3336',
        twiterLightGray:"#71767b",
        twitterDarkGray:"#17181c"
      }
    },
  },
  plugins: [],
}




/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#34BFF1",
        "navy-900": "#0A0D1F",
      },
      backgroundColor: {
        blueDark: "#071455",
        lemonColor: "#9B9C53",
        darkBlue: "#121539",
        black: "#070728",
      },
      fontFamily: {
        Poppins: "Poppins",
        Lato: "Lato",
      },
    },
  },
  plugins: [],
};

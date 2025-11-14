/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                roboto: ['Roboto', 'sans-serif'],
            },
            colors: {
                lightGray: "#F5F5F5",
                electricBlue: "#1E90FF",
                limeGreen: "#7CFC00",
                darkGray: "#2E2E2E",
                vibrantOrange: "#FF8C00",
            },
            borderRadius: {
                sm: "6px",
                md: "8px",
            },
        },
    },
    plugins: [],
}  
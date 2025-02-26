/** @type {import('tailwindcss').Config} */
module.exports = {
     content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // Adjust path based on your project structure
    theme: {
      extend: {},
    },
    plugins: [],
  };
  
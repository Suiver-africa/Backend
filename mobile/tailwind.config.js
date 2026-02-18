/** @type {import('tailwindcss').Config} */
export const content = [
  "./App.tsx",
  "./app/**/*.{ts,tsx,js,jsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
];
export const presets = [require("nativewind/preset")];
export const theme = {
  extend: {
    fontFamily: {
      // Montserrat
      "montserrat-regular": ["Montserrat-Regular"],
      "montserrat-bold": ["Montserrat-Bold"],
      "montserrat-extrabold": ["Montserrat-ExtraBold"],
      "montserrat-extralight": ["Montserrat-ExtraLight"],
      "montserrat-light": ["Montserrat-Light"],
      "montserrat-medium": ["Montserrat-Medium"],
      "montserrat-semibold": ["Montserrat-SemiBold"],

      // Poppins
      "poppins-regular": ["Poppins-Regular"],
      "poppins-bold": ["Poppins-Bold"],
      "poppins-extrabold": ["Poppins-ExtraBold"],
      "poppins-light": ["Poppins-Light"],
      "poppins-medium": ["Poppins-Medium"],
      "poppins-semibold": ["Poppins-SemiBold"],
    },
  },
};
export const plugins = [];

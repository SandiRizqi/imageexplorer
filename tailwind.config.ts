import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xxs: "320px", // Mobile sangat kecil (iPhone 5/SE lama)
        xs: "375px", // Mobile kecil standar (iPhone SE, iPhone 12 mini)
        sm: "640px", // Mobile besar / Phablet
        md: "768px", // Tablet portrait (iPad Mini)
        lg: "1024px", // Tablet landscape / Laptop kecil (iPad Pro)
        xl: "1280px", // Laptop standar (MacBook)
        "2xl": "1536px", // Desktop (iMac 24")
        "3xl": "1920px", // Desktop besar (Monitor Full HD)
        "4xl": "2560px", // Desktop ultra wide (2K/4K)
      },
      colors: {
        maincolor: "#000400",
        secondarycolor: "#141313",
        greenmaincolor: "#c6f832",
        greensecondarycolor: "#6cda00",
        greensecondarycolor1: "#fffa00",
        greensecondarycolor2: "#8fd33f",
        textmaincolor: "#c6f832",

        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#121416",
        },
      },
    },
  },
  plugins: [],
};
export default config;

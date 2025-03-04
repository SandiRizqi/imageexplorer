import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maincolor: "#262a59",
        secondarycolor: "#343b7d",
        buttonmaincolor: "#d410a9",
        buttonsecondarycolor: "#f358d1",
        background: "var(--background)",
        foreground: "var(--foreground)",
        gray: {
          50: "#f8f9fa",  // Lightest gray
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",  // Default Tailwind gray-500
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#121416",  // Darkest gray
        },
      },
    },
  },
  plugins: [],
};
export default config;

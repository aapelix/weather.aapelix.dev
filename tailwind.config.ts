import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      animation: {
        load: "load 1s",
      },
      keyframes: {
        load: {
          "0%": { transform: "translateY(-20px)", opacity: "10%" },
          "100%": { transform: "translateY(0px)", opacity: "100%" },
        },
      },
    },
  },
} satisfies Config;

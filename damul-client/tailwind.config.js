/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    screens: {
      pc_admin: "800px",
      pc: "600px",
      sm: "480px",
      xs: "360px",
    },
    extend: {
      keyframes: {
        shiver: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-1px, 2px)" },
          "40%": { transform: "translate(2px, -2px)" },
          "60%": { transform: "translate(-2px, 1px)" },
          "80%": { transform: "translate(1px, -1px)" },
        },
        wind: {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "25%": { transform: "translate(5px, -2px)" },
          "50%": { transform: "translate(-5px, 2px)" },
          "75%": { transform: "translate(3px, -1px)" },
        },

        wave: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(2deg)" },
          "50%": { transform: "rotate(-2deg)" },
          "75%": { transform: "rotate(2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        shine: {
          "0%": {
            transform: "translate(120%, 120%) rotate(45deg)",
            opacity: "0.1",
          },
          "25%": {
            transform: "translate(60%, 60%) rotate(15deg)",
            opacity: "0.3",
          },
          "50%": {
            transform: "translate(30%, 30%) rotate(0deg)",
            opacity: "0.7",
          },
          "75%": {
            transform: "translate(10%, 10%) rotate(-15deg)",
            opacity: "0.5",
          },
          "100%": {
            transform: "translate(0%, 0%) rotate(-45deg)",
            opacity: "0.1",
          },
        },
      },
      animation: {
        shiver: "shiver 0.2s infinite",
        wind: "wind 3s infinite",
        wave: "wave 0.5s infinite ease-in-out",
        shine: "shine 1s ease-in-out infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        positive: {
          50: "#f2f9ec",
          100: "#e2f2d5",
          200: "#c5e6b0",
          300: "#97d174",
          400: "#7fc259",
          500: "#60a73b",
          600: "#49852b",
          700: "#396625",
          800: "#315222",
          900: "#2b4621",
        },
        negative: {
          50: "#fef2f2",
          100: "#ffe1e1",
          200: "#ffc8c8",
          300: "#ff8b8b",
          400: "#fd6c6c",
          500: "#f53e3e",
          600: "#e22020",
          700: "#be1717",
          800: "#9d1717",
          900: "#821a1a",
        },
        normal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#949494",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
        },
      },
      fontSize: {
        xxxs: "0.5rem", // 8px
        xxs: "0.625rem", // 10px
        xs: "0.75rem", // 12px
        sm: "0.875rem", // 14px
        md: "1rem", // 16px
        lg: "1.125rem", // 18px
      },
      width: {
        22: "5.5rem",
      },
      maxWidth: {
        100: "26rem",
        104: "28rem",
      },

      height: {
        22: "5.5rem",
      },
      borderWidth: {
        1: "1px",
      },
      maxWidth: {
        88: "21rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

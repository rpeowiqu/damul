import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        jest: true, // Jest 환경 추가
      },
    },
    env: {
      jest: true, // Jest 환경 추가
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      "no-empty": "error",
      "no-extra-semi": "error",
      "no-func-assign": "error",
      "no-unreachable": "error",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "eol-last": ["error", "always"],
      "no-trailing-spaces": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      "no-duplicate-imports": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      eqeqeq: ["error", "always"],
      "no-cond-assign": ["error", "always"],
      "no-constant-condition": "error",
      "no-self-compare": "error",
      curly: "error",
      "no-lonely-if": "error",
      yoda: "error",
      "no-use-before-define": "error",
      "func-style": ["error", "expression"],
      "no-multi-assign": "error",
    },
  },
);

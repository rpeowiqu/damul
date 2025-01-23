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
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y, // jsx-a11y 플러그인 추가
    },

    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "error",
        { allowConstantExport: true },
      ],
      // General Rules
      "no-empty": "error", // 비어있는 블록을 허용하지 않습니다.
      "no-extra-semi": "error", // 불필요한 세미콜론을 방지합니다.
      "no-func-assign": "error", // function 선언의 재할당 금지.
      "no-unreachable": "error", // 도달할 수 없는 코드 방지.

      // Code Style Rules
      indent: ["error", 2], // 코드 들여쓰기를 강제합니다.
      quotes: ["error", "double"], // 문자열 따옴표 스타일을 지정합니다.
      semi: ["error", "always"], // 문장의 끝에 세미콜론을 강제합니다.
      "eol-last": ["error", "always"], // 파일의 마지막에 공백 줄을 강제합니다.
      "no-trailing-spaces": "error", // 줄 끝의 불필요한 공백 제거를 강제합니다.

      // Variables Rules
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }], // 사용되지 않는 변수를 방지합니다.
      "no-undef": "error", // 선언되지 않은 변수를 방지합니다.
      "prefer-const": "error", // 값이 재할당되지 않는 경우 let 대신 const 사용을 강제합니다.
      "no-var": "error", // var 사용을 금지하고 let 또는 const를 권장합니다.

      // Import Rules
      "no-duplicate-imports": "error", // 동일한 파일에서 중복된 import를 방지합니다.

      // TypeScript Rules
      "@typescript-eslint/no-empty-interface": "error", // 비어 있는 인터페이스 금지.
      "@typescript-eslint/no-explicit-any": "warn", // any 타입 사용을 방지하거나 경고합니다.

      // React Rules
      "react-hooks/rules-of-hooks": "error", // React Hooks 사용 규칙 강제.
      "react-hooks/exhaustive-deps": "error", // 의존성 배열 검사.

      // Accessibility Rules
      "jsx-a11y/alt-text": "error", // <img> 태그에 alt 속성을 강제합니다.
      "jsx-a11y/anchor-is-valid": "error", // 유효하지 않은 <a> 태그의 사용을 방지합니다.

      // Best Practices
      eqeqeq: ["error", "always"], // == 및 != 사용을 금지하고, 대신 === 및 !== 사용을 강제합니다.
      "no-cond-assign": ["error", "always"], // 조건문에서의 할당(=)을 방지합니다.
      "no-constant-condition": "error", // 항상 true로 평가되는 조건문 방지.
      "no-self-compare": "error", // 변수를 자기 자신과 비교하는 코드 방지.
      curly: "error", // 조건문과 루프에 중괄호 사용을 강제합니다.
      "no-lonely-if": "error", // else 문 내의 단독 if 문을 방지하고 else if를 사용하도록 권장합니다.
      yoda: "error", // Yoda 스타일 비교를 방지합니다.

      // Additional Rules
      "no-use-before-define": "error", // 변수가 정의되기 전에 사용하는 것을 방지합니다.
      "func-style": ["error", "expression"], // 함수 선언 스타일을 강제합니다 (표현식).
      "no-multi-assign": "error", // 여러 변수에 한 번에 할당하는 것을 방지합니다.
    },
  },
);

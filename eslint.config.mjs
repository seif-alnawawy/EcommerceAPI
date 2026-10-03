import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      "prefer-const": "warn",
      "no-unused-vars": "off",
      "no-undef": "error",
      "no-var": "error",

      eqeqeq: "error",

      "prefer-template": "warn",
      "object-shorthand": "warn",

      "consistent-return": "warn",
      "no-shadow": "warn",

      "no-console": "off",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
]);

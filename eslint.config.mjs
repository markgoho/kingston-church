import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import pluginPromise from "eslint-plugin-promise";
import neostandard from "neostandard";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  {
    ignores: ["**/node_modules/", "**/public/", "**/resources/", "admin/build/", "admin/.svelte-kit/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginUnicorn.configs["flat/recommended"],
  pluginPromise.configs["flat/recommended"],
  ...neostandard({ ts: true }),
  eslintConfigPrettier,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
  },
];

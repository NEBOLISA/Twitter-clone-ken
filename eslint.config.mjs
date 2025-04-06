import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 👇 Add your custom rules here
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-as-const":"off",
      "@typescript-eslint/no-empty-object-type":"off",
      "@typescript-eslint/no-non-null-asserted-optional-chain":"off",
      "@typescript-eslint/ban-ts-comment":"off",
      "@typescript-eslint/no-unused-expressions":"off",
      "@typescript-eslint/no-extra-non-null-assertion":"off"
    },
  },
];

export default eslintConfig;

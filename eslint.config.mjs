import next from '@next/eslint-plugin-next';
import typescriptParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      '@next/next': next,
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'error',
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];


{/* import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig; */}

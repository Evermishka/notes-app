import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier';
import react from 'eslint-plugin-react';

export default defineConfig([
  globalIgnores(['dist', 'build', '.vite', 'coverage', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      import: importPlugin,
    },
    rules: {
      eqeqeq: ['error', 'always'], // js.recommended → 'warn'
      'no-console': ['warn', { allow: ['warn', 'error'] }], // По умолчанию запрет всех, разрешаем warn/error
      'react/jsx-key': 'error', // key в списках
    },
  },
]);

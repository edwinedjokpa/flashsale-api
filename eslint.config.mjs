import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base file matching
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },

  // JS script mode
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'script',
    },
  },

  // Globals
  {
    languageOptions: {
      globals: globals.node,
    },
  },

  // JS recommended rules
  pluginJs.configs.recommended,

  // TS recommended rules
  ...tseslint.configs.recommended,

  // 🔥 IMPORT ORDER RULES (THIS IS WHAT YOU WANT)
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        node: true,
      },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // node: fs, path
            'external', // npm packages
            'internal', // @/ modules if you use aliases
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

import packageJson from 'eslint-plugin-package-json';

/** @satisfies {import('eslint').Linter.Config[]} */
export const packageJsonRules = [
  packageJson.configs.recommended,
  {
    name: '@voxpelli/package-json',
    files: ['**/package.json'],
    rules: {
      'package-json/no-empty-fields': ['error', { ignoreProperties: ['files', 'keywords'] }],
      'package-json/sort-collections': 'warn',
      'package-json/scripts-name-casing': 'error',
      'package-json/require-exports': 'warn',
      'package-json/require-sideEffects': 'off',
      'package-json/specify-peers-locally': 'warn',
    },
  },
];

import packageJson from 'eslint-plugin-package-json';

// Fixture package.json files (test harnesses, workspace fixtures,
// type-test scaffolds) intentionally violate package-json rules. Ignore
// them by default so consumers don't have to opt each path out themselves.
const fixtureIgnores = [
  '**/test/**/package.json',
  '**/tests/**/package.json',
  '**/__tests__/**/package.json',
  '**/test-*/package.json',
  '**/test-*/**/package.json',
  '**/fixtures/**/package.json',
  '**/__fixtures__/**/package.json',
];

/** @satisfies {import('eslint').Linter.Config[]} */
export const packageJsonRules = [
  { ...packageJson.configs.recommended, ignores: fixtureIgnores },
  {
    name: '@voxpelli/package-json',
    files: ['**/package.json'],
    ignores: fixtureIgnores,
    rules: {
      'package-json/no-empty-fields': ['error', { ignoreProperties: ['files', 'keywords'] }],
      'package-json/sort-collections': 'warn',
      'package-json/scripts-name-casing': 'warn',
      'package-json/require-exports': 'warn',
      'package-json/require-sideEffects': 'off',
      'package-json/specify-peers-locally': 'warn',
    },
  },
];

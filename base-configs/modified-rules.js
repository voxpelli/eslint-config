/** @satisfies {import('eslint').Linter.FlatConfig[]} */
export const modifiedNeostandardRules = [
  {
    name: '@voxpelli/eslint-config Modified Neostandard TS Rules',
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true,
      }],
    },
  },
  {
    name: '@voxpelli/eslint-config Modified Neostandard Rules',
    rules: {
      'no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true,
      }],
    },
  },
];

/** @satisfies {import('eslint').Linter.FlatConfig[]} */
export const modifiedNeostandardRules = [
  {
    name: '@voxpelli/modified/neostandard',
    rules: {
      'no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true,
      }],
    },
  },
  {
    name: '@voxpelli/modified/neostandard/ts',
    files: ['**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', {
        'vars': 'all',
        'args': 'all',
        'argsIgnorePattern': '^_',
        'ignoreRestSiblings': true,
      }],
    },
  },
];

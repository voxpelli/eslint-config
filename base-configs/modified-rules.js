/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
export const modifiedNeostandardRules = [
  {
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

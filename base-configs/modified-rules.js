/** @satisfies {import('eslint').Linter.Config[]} */
export const modifiedNeostandardRules = [
  {
    name: '@voxpelli/modified/neostandard',
    rules: {
      '@stylistic/comma-dangle': ['warn', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
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

import perfectionist from 'eslint-plugin-perfectionist';

/** @satisfies {import('eslint').Linter.Config[]} */
export const perfectionistRules = [
  {
    name: '@voxpelli/perfectionist',
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': ['warn', { type: 'natural', order: 'asc', newlinesBetween: 'ignore' }],
      'perfectionist/sort-named-imports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-exports': ['warn', { type: 'natural', order: 'asc' }],
    },
  },
];

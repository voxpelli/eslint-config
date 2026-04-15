import perfectionist from 'eslint-plugin-perfectionist';

/** @type {import('eslint').Linter.Config[]} */
export const perfectionistRules = [
  {
    name: '@voxpelli/perfectionist',
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': ['warn', { type: 'natural', order: 'asc', newlinesBetween: 'ignore' }],
      'perfectionist/sort-named-imports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-exports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-objects': ['warn',
        { type: 'natural', order: 'asc', useConfigurationIf: { objectType: 'destructured' } },
        { type: 'unsorted' },
      ],
    },
  },
];

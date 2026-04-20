import perfectionist from 'eslint-plugin-perfectionist';

/** @type {import('eslint').Linter.Config[]} */
export const perfectionistRules = [
  {
    name: '@voxpelli/perfectionist',
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': ['warn', {
        groups: [
          'type-singleline-builtin',
          'type-singleline-external',
          ['type-singleline-parent', 'type-singleline-sibling', 'type-singleline-index'],

          'type-multiline-builtin',
          'type-multiline-external',
          ['type-multiline-parent', 'type-multiline-sibling', 'type-multiline-index'],

          'value-singleline-builtin',
          'value-singleline-external',
          ['value-singleline-parent', 'value-singleline-sibling', 'value-singleline-index'],

          'value-multiline-builtin',
          'value-multiline-external',
          ['value-multiline-parent', 'value-multiline-sibling', 'value-multiline-index'],

          'unknown',
        ],
        newlinesBetween: 'ignore',
      }],
      'perfectionist/sort-named-imports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-named-exports': ['warn', { type: 'natural', order: 'asc' }],
      'perfectionist/sort-objects': ['warn',
        { type: 'natural', order: 'asc', useConfigurationIf: { objectType: 'destructured' } },
        { type: 'unsorted' },
      ],
    },
  },
];

import perfectionist from 'eslint-plugin-perfectionist';

/** @type {import('eslint').Linter.Config[]} */
export const perfectionistRules = [
  {
    name: '@voxpelli/perfectionist',
    plugins: { perfectionist },
    rules: {
      'perfectionist/sort-imports': ['warn', {
        groups: [
          'value-singleline-builtin',
          'value-multiline-builtin',

          'value-singleline-external',
          'value-multiline-external',

          ['value-singleline-parent', 'value-singleline-sibling', 'value-singleline-index'],
          ['value-multiline-parent', 'value-multiline-sibling', 'value-multiline-index'],

          'type-singleline-builtin',
          'type-multiline-builtin',

          'type-singleline-external',
          'type-multiline-external',

          ['type-singleline-parent', 'type-singleline-sibling', 'type-singleline-index'],
          ['type-multiline-parent', 'type-multiline-sibling', 'type-multiline-index'],

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

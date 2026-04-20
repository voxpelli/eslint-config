import jsdoc from 'eslint-plugin-jsdoc';

/** @satisfies {import('eslint').Linter.Config[]} */
export const jsdocRules = [
  jsdoc.configs['flat/recommended-typescript-flavor'],
  {
    name: '@voxpelli/jsdoc',
    rules: {
      'jsdoc/check-tag-names': ['warn', { definedTags: ['planned'] }],
      'jsdoc/check-types': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/reject-any-type': 'off',
      'jsdoc/reject-function-type': 'off',
      'jsdoc/require-next-description': 'off',
      'jsdoc/require-throws-description': 'off',
      'jsdoc/require-yields': 'off',
      'jsdoc/require-yields-description': 'off',
      'jsdoc/tag-lines': ['warn', 'never', { 'startLines': 1 }],
      'jsdoc/valid-types': 'off',
    },
  },
];

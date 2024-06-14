import jsdoc from 'eslint-plugin-jsdoc';

/** @satisfies {import('eslint').Linter.FlatConfig[]} */
export const jsdocRules = [
  jsdoc.configs['flat/recommended-typescript-flavor'],
  {
    name: '@voxpelli/jsdoc',
    rules: {
      'jsdoc/check-types': 'off',
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-yields': 'off',
      'jsdoc/tag-lines': ['warn', 'never', { 'startLines': 1 }],
      'jsdoc/valid-types': 'off',
    },
  },
];

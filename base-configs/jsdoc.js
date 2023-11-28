'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  plugins: [
    'jsdoc',
  ],
  'extends': [
    'plugin:jsdoc/recommended',
  ],
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    'jsdoc/check-types': 'off',
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-property-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-yields': 'off',
    'jsdoc/tag-lines': ['warn', 'never', { 'startLines': 1 }],
    'jsdoc/valid-types': 'off',
  },
};

module.exports = config;

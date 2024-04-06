'use strict';

// @ts-ignore
const jsdoc = require('eslint-plugin-jsdoc');

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.Rules} */
const rules = {
  'jsdoc/check-types': 'off',
  'jsdoc/require-jsdoc': 'off',
  'jsdoc/require-param-description': 'off',
  'jsdoc/require-property-description': 'off',
  'jsdoc/require-returns-description': 'off',
  'jsdoc/require-yields': 'off',
  'jsdoc/tag-lines': ['warn', 'never', { 'startLines': 1 }],
  'jsdoc/valid-types': 'off',
};

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
const flat = [
  jsdoc.configs['flat/recommended-typescript-flavor'],
  {
    files: ['**/*.js'],
    plugins: {
      jsdoc,
    },
    rules,
  }
];


/** @satisfies {import('eslint').ESLint.ConfigData} */
const legacy = {
  plugins: [
    'jsdoc',
  ],
  'extends': [
    'plugin:jsdoc/recommended-typescript-flavor',
  ],
  rules,
};

module.exports = {
  flat,
  legacy,
};

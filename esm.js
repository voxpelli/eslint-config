'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  'extends': [
    './',
  ],
  root: true,
  rules: {
    // Overrides of @voxpelli rules
    'func-style': ['warn', 'declaration', { 'allowArrowFunctions': true }],
    'unicorn/prefer-module': 'error',
  },
};

module.exports = config;

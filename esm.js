'use strict';

module.exports = {
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

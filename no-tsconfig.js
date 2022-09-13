'use strict';

module.exports = {
  'extends': [
    './'
  ],
  root: true,
  parserOptions: {
    // eslint-disable-next-line unicorn/no-null
    project: null,
  },
  rules: {
    // Skip rules that require a "tsconfig"
    '@typescript-eslint/no-implied-eval': 0,
    '@typescript-eslint/no-throw-literal': 0,
  }
};

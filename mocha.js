'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  plugins: ['mocha'],
  env: {
    'mocha': true,
  },
  'extends': [
    'plugin:mocha/recommended',
  ],
  rules: {
    '@typescript-eslint/no-unused-expressions': 'off',
    'mocha/no-mocha-arrows': 'off',
    'no-unused-expressions': 'off',
  },
};

module.exports = config;

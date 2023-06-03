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
    'mocha/no-mocha-arrows': 'off',
    'no-unused-expressions': 'off',
  },
};

module.exports = config;

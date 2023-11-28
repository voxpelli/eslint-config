'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  rules: {
    // Make it "semistandard"

    'semi': ['error', 'always'],
    'no-extra-semi': 'error',

    // Changed "standard" rules

    'comma-dangle': ['warn', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'never',
    }],
    'dot-notation': 'off',
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
    'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'all',
      'argsIgnorePattern': '^_',
      'ignoreRestSiblings': true,
    }],
    'n/no-deprecated-api': 'warn',
  },
};

module.exports = config;

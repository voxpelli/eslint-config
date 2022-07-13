/* eslint-disable unicorn/prefer-module */

'use strict';

module.exports = {
  plugins: [
    'es',
    'import',
    'jsdoc',
    'mocha',
    'promise',
    'security',
    'sort-destructure-keys',
    'unicorn'
  ],
  'extends': [
    'standard',
    'plugin:n/recommended',
    'plugin:security/recommended',
    'plugin:mocha/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:jsdoc/recommended'
  ],
  root: true,
  settings: {
    jsdoc: {
      mode: 'typescript'
    }
  },
  rules: {
    // Make it "semistandard"

    'semi': ['error', 'always'],
    'no-extra-semi': 'error',

    // Changed "standard" rules

    'comma-dangle': ['warn', {
      'arrays': 'ignore',
      'objects': 'ignore',
      'imports': 'ignore',
      'exports': 'ignore',
      'functions': 'never'
    }],
    'dot-notation': 'off',
    'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
    'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'all',
      'argsIgnorePattern': '^_',
      'ignoreRestSiblings': true
    }],
    'n/no-deprecated-api': 'warn',

    // Added ESLint core rules

    'func-style': ['warn', 'expression', { 'allowArrowFunctions': true }],
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-warning-comments': ['warn', { 'terms': ['fixme'] }],
    'object-shorthand': ['error', 'properties', { 'avoidQuotes': true }],
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'numbers': true, 'unnecessary': false }],

    // Overrides of other extended ESLint rule packages

    'jsdoc/check-types': 0,
    'jsdoc/no-undefined-types': 0,
    'jsdoc/require-jsdoc': 0,
    'jsdoc/require-param-description': 0,
    'jsdoc/require-property-description': 0,
    'jsdoc/require-returns-description': 0,
    'jsdoc/require-yields': 0,
    'jsdoc/valid-types': 0,

    'mocha/no-mocha-arrows': 'off',

    'n/no-process-exit': 'off',

    'security/detect-object-injection': 'off',
    'security/detect-unsafe-regex': 'off',

    'unicorn/catch-error-name': ['error', { 'name': 'err' }],
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-await-expression-member': 'warn',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-add-event-listener': 'warn',
    'unicorn/prefer-event-target': 'warn',
    'unicorn/prefer-module': 'warn',
    'unicorn/prefer-spread': 'warn',
    'unicorn/prevent-abbreviations': 'off',

    // Additional standalone ESLint rules

    'es/no-exponential-operators': 'warn',

    'n/prefer-global/console': 'warn',
    'n/prefer-promises/fs': 'warn',
    'n/no-process-env': 'warn',
    'n/no-sync': 'error',

    'promise/prefer-await-to-then': 'error',

    'sort-destructure-keys/sort-destructure-keys': 'error'
  }
};

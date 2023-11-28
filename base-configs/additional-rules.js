'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  plugins: [
    'es-x',
    'import',
    'jsdoc',
    'promise',
    'security',
    'sort-destructure-keys',
    'unicorn',
  ],
  'extends': [
    'plugin:n/recommended',
    'plugin:security/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    // Added ESLint core rules

    'func-style': ['warn', 'expression', { 'allowArrowFunctions': true }],
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-warning-comments': ['warn', { 'terms': ['fixme'] }],
    'object-shorthand': ['error', 'properties', { 'avoidQuotes': true }],
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'numbers': true, 'unnecessary': false }],

    // Overrides of other extended ESLint rule packages

    'n/no-process-exit': 'off',

    'security/detect-object-injection': 'off',
    'security/detect-unsafe-regex': 'off',

    'unicorn/catch-error-name': ['error', { name: 'err', ignore: ['^cause$'] }],
    'unicorn/explicit-length-check': 'off',
    'unicorn/no-await-expression-member': 'warn',
    'unicorn/no-negated-condition': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-add-event-listener': 'warn',
    'unicorn/prefer-event-target': 'warn',
    'unicorn/prefer-module': 'off',
    'unicorn/prefer-string-replace-all': 'warn',
    'unicorn/prefer-spread': 'warn',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/switch-case-braces': ['error', 'avoid'],

    // Additional standalone ESLint rules

    'es-x/no-exponential-operators': 'warn',

    'n/prefer-global/console': 'warn',
    'n/prefer-promises/fs': 'warn',
    'n/no-process-env': 'warn',
    'n/no-sync': 'error',

    'import/no-deprecated': 1,
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'type'],
      },
    ],

    'promise/prefer-await-to-then': 'error',

    'sort-destructure-keys/sort-destructure-keys': 'error',
  },
};

module.exports = config;

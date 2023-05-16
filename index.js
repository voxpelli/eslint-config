'use strict';

module.exports = {
  plugins: [
    'es-x',
    'import',
    'jsdoc',
    'mocha',
    'promise',
    'security',
    'sort-destructure-keys',
    'unicorn',
  ],
  'extends': [
    './standard',
    'plugin:n/recommended',
    'plugin:security/recommended',
    'plugin:mocha/recommended',
    'plugin:unicorn/recommended',
    'plugin:promise/recommended',
    'plugin:jsdoc/recommended',
  ],
  root: true,
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
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

    // Added ESLint core rules

    'func-style': ['warn', 'expression', { 'allowArrowFunctions': true }],
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-warning-comments': ['warn', { 'terms': ['fixme'] }],
    'object-shorthand': ['error', 'properties', { 'avoidQuotes': true }],
    'quote-props': ['error', 'as-needed', { 'keywords': true, 'numbers': true, 'unnecessary': false }],

    // Overrides of other extended ESLint rule packages

    'jsdoc/check-types': 'off',
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-property-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-yields': 'off',
    'jsdoc/tag-lines': ['warn', 'never', { 'startLines': 1 }],
    'jsdoc/valid-types': 'off',

    'mocha/no-mocha-arrows': 'off',

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

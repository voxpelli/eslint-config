/* eslint-disable unicorn/prefer-module */

'use strict';

module.exports = {
  plugins: [
    '@shopify',
    'es',
    'import',
    'jsdoc',
    'mocha',
    'promise',
    'security',
    'sort-class-members',
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

    'jsdoc/check-types': 'off',
    'jsdoc/no-undefined-types': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param-description': 'off',
    'jsdoc/require-property-description': 'off',
    'jsdoc/require-returns-description': 'off',
    'jsdoc/require-yields': 'off',
    'jsdoc/valid-types': 'off',

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

    // Borrowed from @shopify/eslint-plugin esnext rules
    'sort-class-members/sort-class-members': [
      'error',
      {
        order: [
          '[static-members]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
          '[everything-else]',
        ],
        groups: {
          'static-members': [{ 'static': true }],
        },
        accessorPairPositioning: 'getThenSet',
      },
    ],

    'sort-destructure-keys/sort-destructure-keys': 'error',

    // Shopify ones

    // Require (or disallow) assignments of binary, boolean-producing expressions to be wrapped in parentheses.
    '@shopify/binary-assignment-parens': ['error', 'always'],
    // Require (or disallow) semicolons for class properties.
    '@shopify/class-property-semi': 'error',
    // Prefer that imports from within a directory extend to the file from where they are importing without relying on an index file.
    '@shopify/no-ancestor-directory-import': 'warn',
    // Prevent namespace import declarations
    '@shopify/no-namespace-imports': 'warn',
    // Prevent the usage of unnecessary computed properties.
    '@shopify/no-useless-computed-properties': 'error',
    // Prevent the declaration of classes consisting only of static members.
    '@shopify/no-fully-static-classes': 'error',
    // Prefer class properties to assignment of literals in constructors.
    '@shopify/prefer-class-properties': 'warn',
    // Prefer early returns over full-body conditional wrapping in function declarations.
    '@shopify/prefer-early-return': ['error', { maximumStatements: 1 }],
    // Prefer that screaming snake case variables always be defined using `const`, and always appear at module scope.
    '@shopify/prefer-module-scope-constants': 'error',
    // Restrict the use of specified sinon features.
    '@shopify/sinon-no-restricted-features': 'warn',
    // Require the use of meaningful sinon assertions through sinon.assert or sinon-chai.
    '@shopify/sinon-prefer-meaningful-assertions': 'warn',
    // Prevent module imports between components.
    '@shopify/strict-component-boundaries': 'warn',
  }
};

import { plugins } from 'neostandard';
// @ts-ignore
import esxPlugin from 'eslint-plugin-es-x';
// import importPlugin from 'eslint-plugin-import-x';
import securityPlugin from 'eslint-plugin-security';
// @ts-ignore
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import unicornPlugin from 'eslint-plugin-unicorn';

/** @satisfies {import('eslint').Linter.Config} */
const additionalCoreRules = {
  name: '@voxpelli/additional/core',
  rules: {
    // Added ESLint core rules
    'func-style': ['warn', 'expression', { 'allowArrowFunctions': true }],
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-warning-comments': ['warn', { 'terms': ['fixme'] }],
    'object-shorthand': ['error', 'properties', { 'avoidQuotes': true }],
    '@stylistic/quote-props': ['error', 'as-needed', { 'keywords': true, 'numbers': true, 'unnecessary': false }],
  },
};

/** @satisfies {import('eslint').Linter.Config[]} */
const adaptedUnicornRules = [
  unicornPlugin.configs['flat/recommended'],
  {
    name: '@voxpelli/additional/unicorn',
    rules: {
      // Overriding
      'unicorn/catch-error-name': ['error', { name: 'err', ignore: ['^cause$'] }],
      'unicorn/explicit-length-check': 'off',
      'unicorn/no-await-expression-member': 'warn',
      'unicorn/no-negated-condition': 'off',
      'unicorn/numeric-separators-style': 'off',
      'unicorn/prefer-add-event-listener': 'warn',
      'unicorn/prefer-event-target': 'warn',
      'unicorn/prefer-module': 'off',
      'unicorn/prefer-spread': 'warn',
      'unicorn/prefer-string-raw': 'off',
      'unicorn/prefer-string-replace-all': 'warn',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': ['error', 'avoid'],
    },
  },
];

/** @satisfies {import('eslint').Linter.Config[]} */
export const additionalRules = [
  additionalCoreRules,
  ...adaptedUnicornRules,
  securityPlugin.configs.recommended,
  /** @type {import('eslint').Linter.Config} */ (plugins.promise.configs['flat/recommended']),
  {
    name: '@voxpelli/additional/misc',
    plugins: {
      'es-x': esxPlugin,
      // TODO: Add back
      // 'import': importPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin,
    },
    rules: {
      // Overrides of other extended ESLint rule packages

      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'off',

      // Additional standalone ESLint rules

      'es-x/no-exponential-operators': 'warn',

      // 'import/no-deprecated': 1,
      // 'import/order': [
      //   'error',
      //   {
      //     'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'type'],
      //   },
      // ],

      'promise/prefer-await-to-then': 'error',

      'sort-destructure-keys/sort-destructure-keys': 'error',
    },
  },
];

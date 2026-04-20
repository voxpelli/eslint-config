import esxPlugin from 'eslint-plugin-es-x';
import securityPlugin from 'eslint-plugin-security';
import unicornPlugin from 'eslint-plugin-unicorn';
import { plugins } from 'neostandard';

/** @satisfies {import('eslint').Linter.Config} */
const additionalCoreRules = {
  name: '@voxpelli/additional/core',
  rules: {
    // Added ESLint core rules
    'arrow-body-style': ['warn', 'as-needed'],
    'func-style': ['warn', 'expression', { 'allowArrowFunctions': true }],
    'no-console': 'warn',
    'no-constant-binary-expression': 'error',
    'no-unsafe-optional-chaining': ['error', { 'disallowArithmeticOperators': true }],
    'no-warning-comments': ['warn', { 'terms': ['fixme'] }],
    'object-shorthand': ['error', 'properties', { 'avoidQuotes': true }],
    'prefer-arrow-callback': 'warn',
    'prefer-destructuring': ['warn', {
      'VariableDeclarator': { 'array': false, 'object': true },
      'AssignmentExpression': { 'array': false, 'object': false },
    }],
    'prefer-object-spread': 'error',
  },
};

/** @satisfies {import('eslint').Linter.Config[]} */
const adaptedUnicornRules = [
  unicornPlugin.configs.recommended,
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

      // New rules from v57-v64 — stylistic/opinionated overrides
      'unicorn/consistent-assert': 'warn',
      'unicorn/consistent-template-literal-escape': 'warn',
      'unicorn/isolated-functions': 'warn',
      'unicorn/no-array-reverse': 'warn',
      'unicorn/no-array-sort': 'warn',
      'unicorn/no-immediate-mutation': 'warn',
      'unicorn/prefer-class-fields': 'warn',
      'unicorn/prefer-classlist-toggle': 'warn',
      'unicorn/prefer-import-meta-properties': 'off',
      'unicorn/prefer-response-static-json': 'warn',
      'unicorn/prefer-simple-condition-first': 'warn',
      'unicorn/switch-case-break-position': 'warn',
    },
  },
];

const { promise: promisePlugin } = /** @type {{ promise: { configs: { 'flat/recommended': import('eslint').Linter.Config } } }} */ (plugins);
const promiseRecommended = promisePlugin.configs['flat/recommended'];

/** @satisfies {import('eslint').Linter.Config[]} */
export const additionalStyleRules = [
  {
    name: '@voxpelli/additional/core/style',
    rules: {
      '@stylistic/quote-props': ['error', 'as-needed', { 'keywords': true, 'numbers': true, 'unnecessary': false }],
    },
  },
];

/** @satisfies {import('eslint').Linter.Config[]} */
export const additionalRules = [
  additionalCoreRules,
  ...adaptedUnicornRules,
  securityPlugin.configs.recommended,
  promiseRecommended,
  {
    name: '@voxpelli/additional/misc',
    plugins: {
      'es-x': esxPlugin,
    },
    rules: {
      // Overrides of other extended ESLint rule packages

      'security/detect-object-injection': 'off',
      'security/detect-unsafe-regex': 'off',

      // Additional standalone ESLint rules

      'es-x/no-exponential-operators': 'warn',

      'promise/prefer-await-to-then': 'error',
    },
  },
];

/** @satisfies {import('eslint').Linter.FlatConfig[]} */
export const esmRules = [
  {
    rules: {
      // Overrides of other rules
      'func-style': ['warn', 'declaration', { 'allowArrowFunctions': true }],
      'unicorn/prefer-module': 'error',
    },
  },
];

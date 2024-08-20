/** @satisfies {import('eslint').Linter.Config[]} */
export const esmRules = [
  {
    name: '@voxpelli/esm',
    rules: {
      // Overrides of other rules
      'func-style': ['warn', 'declaration', { 'allowArrowFunctions': true }],
      'unicorn/prefer-module': 'error',
    },
  },
];

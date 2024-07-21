import { plugins } from 'neostandard';

/**
 * @param {boolean} cjs
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
export function nodeRules (cjs) {
  return [
    {
      ...plugins.n.configs['flat/recommended-module'],
      // If CommonJS, only target *.mjs, target everything but *.cjs
      ...cjs ? { files: ['**/*.mjs'] } : { ignores: ['**/*.cjs'] },
    },
    {
      ...plugins.n.configs['flat/recommended-script'],
      // If CommonJS, target everything but *.mjs, else only target *.cjs
      ...cjs ? { ignores: ['**/*.mjs'] } : { files: ['**/*.cjs'] },
    },
    {
      name: '@voxpelli/additional/node',
      rules: {
        // Overriding
        'n/no-process-exit': 'off',

        // Adding
        'n/prefer-global/console': 'warn',
        'n/prefer-promises/fs': 'warn',
        'n/no-process-env': 'warn',
        'n/no-sync': 'error',
      },
    },
    {
      name: '@voxpelli/additional/node/dts',
      files: ['**/*.ts'],
      rules: {
        // TODO: Remove when *.js files can be properly resolved from *.d.ts
        'n/no-missing-import': 'off',
        'n/no-unsupported-features/es-syntax': 'off',
      },
    },
  ];
}

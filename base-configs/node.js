import { plugins } from 'neostandard';

/**
 * @param {ReturnType<typeof import('neostandard')['resolveFilePatterns']>} filePatterns
 * @returns {import('eslint').Linter.Config[]}
 */
export function nodeRules (filePatterns) {
  const {
    ignores,
    jsTsFiles,
    tsFiles,
  } = filePatterns;

  return [
    {
      ...plugins.n.configs['flat/recommended-module'],
      files: jsTsFiles,
      ignores: [
        ...ignores,
        '**/*.cjs',
      ],
    },
    {
      ...plugins.n.configs['flat/recommended-script'],
      files: ['**/*.cjs'],
      ignores,
    },
    {
      name: '@voxpelli/additional/node',
      files: jsTsFiles,
      ignores,
      rules: {
        // Overriding
        'n/no-extraneous-import': 'off',
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
      files: tsFiles,
      ignores,
      rules: {
        // TODO: Remove when *.js files can be properly resolved from *.d.ts
        'n/no-missing-import': 'off',
        'n/no-unsupported-features/es-syntax': 'off',
      },
    },
  ];
}

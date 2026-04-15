/**
 * @param {string[]} files
 * @returns {import('eslint').Linter.Config[]}
 */
export function cliFilesConfig (files) {
  return /** @satisfies {import('eslint').Linter.Config[]} */ ([
    {
      name: '@voxpelli/cli-files',
      files,
      rules: {
        'n/no-process-env': 'off',
        'n/no-sync': 'off',
        'n/no-unsupported-features/node-builtins': 'off',
        'no-console': 'off',
        'promise/prefer-await-to-then': 'off',
        'unicorn/no-process-exit': 'off',
        'unicorn/prefer-top-level-await': 'off',
      },
    },
  ]);
}

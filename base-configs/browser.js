import globals from 'globals';

/**
 * @param {string[]} files
 * @returns {import('eslint').Linter.Config[]}
 */
export function browserFilesConfig (files) {
  return /** @satisfies {import('eslint').Linter.Config[]} */ ([
    {
      name: '@voxpelli/browser-files',
      files,
      languageOptions: { globals: globals.browser },
      rules: {
        // Node.js built-in checks do not apply to browser-bundled code
        'n/no-unsupported-features/node-builtins': 'off',
        // Bundlers (esbuild, Vite, etc.) resolve imports, not Node.js
        'n/no-missing-import': 'off',
        // Browser code has no process.env
        'n/no-process-env': 'off',
        // console is a browser global, not a Node.js one
        'n/prefer-global/console': 'off',
        // Sync I/O APIs do not exist in the browser
        'n/no-sync': 'off',
        // DOM APIs (querySelector, etc.) return null legitimately
        'unicorn/no-null': 'off',
      },
    },
  ]);
}

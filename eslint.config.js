import { voxpelli } from './index.js';

export default [
  ...voxpelli(),

  // Dev tools — CLI scripts that run outside the library context
  {
    name: 'project/tools',
    files: ['tools/**/*.js'],
    rules: {
      'n/no-process-env': 'off',
      'n/no-sync': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'no-console': 'off',
      'unicorn/no-process-exit': 'off',
    },
  },
];

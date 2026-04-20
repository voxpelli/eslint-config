import { voxpelli } from './index.js';

export default [
  ...voxpelli({
    cliFiles: ['tools/**/*.js'],
    ignores: ['test/fixtures/**'],
  }),
];

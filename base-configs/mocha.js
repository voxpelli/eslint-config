// @ts-ignore
import mochaPlugin from 'eslint-plugin-mocha';

const ignores = ['**/*', '!test/**/*'];

/** @satisfies {import('eslint').Linter.Config[]} */
export const mochaRules = [
  {
    ...mochaPlugin.configs.flat.recommended,
    ignores,
  },
  {
    name: '@voxpelli/mocha',
    ignores,
    rules: {
      'mocha/no-mocha-arrows': 'off',
      'no-unused-expressions': 'off',
    },
  },
  {
    name: '@voxpelli/mocha/ts',
    ignores,
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
];

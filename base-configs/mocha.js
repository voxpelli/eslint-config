// @ts-ignore
import mochaPlugin from 'eslint-plugin-mocha';
import { config } from 'typescript-eslint';

export const mochaRules = config({
  ignores: ['**/*', '!test/**/*'],
  'extends': [
    mochaPlugin.configs.flat.recommended,
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
      },
    },
  ],
  rules: {
    'mocha/no-mocha-arrows': 'off',
    'no-unused-expressions': 'off',
  },
});

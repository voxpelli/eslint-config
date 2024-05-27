// @ts-ignore
import mochaPlugin from 'eslint-plugin-mocha';
import globals from 'globals';
import { config } from 'typescript-eslint';

export const mochaRules = config({
  ignores: ['**/*', '!test/**/*'],
  'extends': [
    mochaPlugin.configs.flat.recommended,
  ],
  languageOptions: {
    globals: {
      ...globals.mocha,
    },
  },
  rules: {
    'mocha/no-mocha-arrows': 'off',
    'no-unused-expressions': 'off',
  },
});

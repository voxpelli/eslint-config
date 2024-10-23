import { configs } from 'eslint-plugin-regexp';

/** @satisfies {import('eslint').Linter.Config[]} */
export const regexpRules = [
  configs['flat/recommended'],
];

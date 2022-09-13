// Use to generate an up to date @typescript-eslint adapted standardjs,
// which makes use of all extended rules https://typescript-eslint.io/rules/#extension-rules
// Similar to https://github.com/typescript-eslint/typescript-eslint/blob/f4016c24f9023e8a42def9501b68c4a908cbfede/packages/eslint-plugin/src/configs/recommended.ts

const standard = require('./base-configs/standard');
const { rules } = require('@typescript-eslint/eslint-plugin');

const replacedRules = {};
const replacementRules = {};

for (const ruleId in rules) {
  if (standard.rules[ruleId] && rules[ruleId].meta.docs.extendsBaseRule) {
    replacedRules[ruleId] = 'off';
    replacementRules['@typescript-eslint/' + ruleId] = standard.rules[ruleId];
  }
}

const config = {
  'extends': ['./base-configs/standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    ...replacedRules,
    ...replacementRules,
  },
};

module.exports = config;

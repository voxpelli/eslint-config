// Use to generate an up to date @typescript-eslint adapted standardjs,
// which makes use of all extended rules https://typescript-eslint.io/rules/#extension-rules
// Similar to https://github.com/typescript-eslint/typescript-eslint/blob/f4016c24f9023e8a42def9501b68c4a908cbfede/packages/eslint-plugin/src/configs/recommended.ts

const { rules: standardRules } = require('./standard');
const { rules } = require('@typescript-eslint/eslint-plugin');

/** @type {import('eslint').Linter.RulesRecord} */
const replacedRules = {};
/** @type {import('eslint').Linter.RulesRecord} */
const replacementRules = {};

for (const tsRuleId in rules) {
  const ruleId = /** @type {(keyof typeof standardRules) | undefined} */ (
    tsRuleId in standardRules
      ? tsRuleId
      : undefined
  );

  if (ruleId && rules[ruleId]?.meta?.docs?.extendsBaseRule) {
    replacedRules[ruleId] = 'off';
    replacementRules['@typescript-eslint/' + ruleId] = standardRules[ruleId];
  }
}

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  'extends': ['./standard'],
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

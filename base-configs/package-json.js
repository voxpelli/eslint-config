import packageJson from 'eslint-plugin-package-json';
import { defineConfig } from 'eslint/config';

// Fixture package.json files (test harnesses, workspace fixtures,
// type-test scaffolds) intentionally violate package-json rules. Ignore
// them by default so consumers don't have to opt each path out themselves.
// The parent block's `ignores` propagates through `extends` to the
// recommended preset, gating it without cloning the preset object.
const fixtureIgnores = [
  '**/test/**/package.json',
  '**/tests/**/package.json',
  '**/__tests__/**/package.json',
  '**/test-*/package.json',
  '**/test-*/**/package.json',
  '**/fixtures/**/package.json',
  '**/__fixtures__/**/package.json',
];

export const packageJsonRules = defineConfig({
  name: '@voxpelli/package-json',
  files: ['**/package.json'],
  ignores: fixtureIgnores,
  'extends': [packageJson.configs.recommended],
  rules: {
    'package-json/no-empty-fields': ['error', { ignoreProperties: ['files', 'keywords'] }],
    'package-json/sort-collections': 'warn',
    'package-json/scripts-name-casing': 'warn',
    'package-json/require-exports': 'off',
    'package-json/require-sideEffects': 'off',
    'package-json/specify-peers-locally': 'warn',
    // Conflicts with `n/no-unpublished-bin`: npm auto-includes files listed
    // in `bin`/`main`/`man` regardless of the `files` field, but
    // eslint-plugin-n does not model that and reports a false positive when
    // those entries are removed from `files`, so fixing one triggers the other.
    'package-json/no-redundant-files': 'off',
  },
});

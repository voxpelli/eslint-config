import { neostandardSemi, neostandardTsOnlySemi } from '@voxpelli/neostandard';

import additionalRules from './base-configs/additional-rules.js';
import jsdoc from './base-configs/jsdoc.js';

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
export const cjs = [
  neostandardSemi,
  additionalRules.flat,
  jsdoc.flat,
];

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
export const esm = [
  ...cjs,
  {
    rules: {
      // Overrides of @voxpelli rules
      'func-style': ['warn', 'declaration', { 'allowArrowFunctions': true }],
      'unicorn/prefer-module': 'error',
    },
  },
];

/** @satisfies {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray} */
export const esmTypesInJs = [
  ...esm,
  ...neostandardTsOnlySemi,
];

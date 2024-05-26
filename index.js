import neostandard from 'neostandard';

import { additionalRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';

/**
 * @param {{ cjs?: boolean, noMocha?: boolean }} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function voxpelli ({ cjs, noMocha } = {}) {
  return [
    ...neostandard({ semi: true }),
    ...additionalRules,
    ...jsdocRules,
    ...cjs ? [] : esmRules,
    ...noMocha ? [] : mochaRules,
  ];
}

export default voxpelli();

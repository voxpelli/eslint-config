import neostandard from 'neostandard';

import { additionalRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';

/**
 * @param {{ cjs?: boolean }} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function voxpelli ({ cjs } = {}) {
  return [
    ...neostandard({ semi: true }),
    ...additionalRules,
    ...jsdocRules,
    ...cjs ? [] : esmRules,
  ];
}

export default voxpelli();

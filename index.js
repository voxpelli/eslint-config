import neostandard from 'neostandard';
import { config } from 'typescript-eslint';

import { additionalRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { modifiedNeostandardRules } from './base-configs/modified-rules.js';

/**
 * @param {{ cjs?: boolean, noMocha?: boolean } & import('neostandard').NeostandardOptions} [options]
 * @returns {import('@typescript-eslint/utils/ts-eslint').FlatConfig.ConfigArray}
 */
export function voxpelli (options) {
  const {
    cjs,
    ignores,
    noMocha,
    ...neostandardOptions
  } = options || {};

  return config({
    ...ignores && { ignores },
    'extends': [
      ...neostandard({
        semi: true,
        ts: true,
        ...neostandardOptions,
      }),
      ...modifiedNeostandardRules,
      ...additionalRules,
      ...jsdocRules,
      ...cjs ? [] : esmRules,
      ...noMocha ? [] : mochaRules,
    ],
  });
}

export default voxpelli();

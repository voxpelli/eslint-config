import neostandard, { resolveIgnoresFromGitignore } from 'neostandard';

import { additionalRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { modifiedNeostandardRules } from './base-configs/modified-rules.js';

/**
 * @param {{ cjs?: boolean, noMocha?: boolean } & import('neostandard').NeostandardOptions} [options]
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
export function voxpelli (options) {
  const {
    cjs,
    ignores,
    noMocha,
    ...neostandardOptions
  } = options || {};

  return [
    {
      name: '@voxpelli/ignores',
      ignores: [
        'coverage/**/*',
        ...resolveIgnoresFromGitignore(),
        ...ignores || [],
      ],
    },
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
  ];
}

export default voxpelli();

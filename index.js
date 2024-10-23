import neostandard, { resolveIgnoresFromGitignore } from 'neostandard';

import { additionalRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { nodeRules } from './base-configs/node.js';
import { regexpRules } from './base-configs/regexp.js';
import { modifiedNeostandardRules } from './base-configs/modified-rules.js';

/**
 * @param {{ cjs?: boolean, noMocha?: boolean } & import('neostandard').NeostandardOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export function voxpelli (options) {
  const {
    cjs = false,
    ignores: rawIgnores,
    noMocha,
    ...neostandardOptions
  } = options || {};

  const ignores = [
    'coverage/**/*',
    ...resolveIgnoresFromGitignore(),
    ...rawIgnores || [],
  ];

  return [
    // If ignores is the lone key, then that amounts to being global ignores: https://eslint.org/docs/latest/use/configure/configuration-files#globally-ignoring-files-with-ignores
    { ignores },
    ...neostandard({
      semi: true,
      ts: true,
      ...neostandardOptions,
    }),
    ...modifiedNeostandardRules,
    ...additionalRules,
    ...jsdocRules,
    ...regexpRules,
    ...nodeRules(cjs),
    ...cjs ? [] : esmRules,
    ...noMocha ? [] : mochaRules,
  ];
}

export default voxpelli();

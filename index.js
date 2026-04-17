import neostandard, { resolveIgnoresFromGitignore } from 'neostandard';

import { additionalRules, additionalStyleRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { modifiedNeostandardRules, modifiedNeostandardStyleRules } from './base-configs/modified-rules.js';
import { nodeRules } from './base-configs/node.js';
import { perfectionistRules } from './base-configs/perfectionist.js';
import { regexpRules } from './base-configs/regexp.js';
import { browserFilesConfig } from './profiles/browser.js';
import { cliFilesConfig } from './profiles/cli.js';

/**
 * @typedef {{ browserFiles?: string[], cliFiles?: string[], cjs?: boolean, noMocha?: boolean } & import('neostandard').NeostandardOptions} VoxpelliOptions
 */

/** @satisfies {Record<keyof VoxpelliOptions, true>} */
const VALID_OPTIONS_MAP = {
  // voxpelli-specific
  browserFiles: true,
  cliFiles: true,
  cjs: true,
  noMocha: true,
  // neostandard pass-through
  env: true,
  files: true,
  filesTs: true,
  globals: true,
  ignores: true,
  noJsx: true,
  noStyle: true,
  semi: true,
  ts: true,
};

/** @type {ReadonlySet<string>} */
const VALID_OPTIONS = new Set(Object.keys(VALID_OPTIONS_MAP));

/**
 * @param {VoxpelliOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export function voxpelli (options) {
  if (options) {
    for (const key of Object.keys(options)) {
      if (!VALID_OPTIONS.has(key)) {
        throw new TypeError(
          `voxpelli() received unknown option: "${key}". ` +
          `Valid options: ${[...VALID_OPTIONS].join(', ')}. ` +
          'Custom rules/plugins go in a separate config object: ' +
          '[...voxpelli(), { rules: { ... } }]'
        );
      }
    }
  }

  const {
    browserFiles,
    cjs = false,
    cliFiles,
    ignores: rawIgnores,
    noMocha,
    noStyle,
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
      noStyle,
      ...neostandardOptions,
    }),
    ...modifiedNeostandardRules,
    ...noStyle ? [] : modifiedNeostandardStyleRules,
    ...additionalRules,
    ...noStyle ? [] : additionalStyleRules,
    ...jsdocRules,
    ...regexpRules,
    ...nodeRules(cjs),
    ...cjs ? [] : esmRules,
    ...noStyle ? [] : perfectionistRules,
    ...noMocha ? [] : mochaRules,
    ...browserFiles?.length ? browserFilesConfig(browserFiles) : [],
    ...cliFiles?.length ? cliFilesConfig(cliFiles) : [],
  ];
}

export { plugins } from 'neostandard';
export { default as globals } from 'globals';

export { browserFilesConfig as browserFiles } from './profiles/browser.js';
export { cliFilesConfig as cliFiles } from './profiles/cli.js';

export default voxpelli();

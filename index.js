import neostandard, { resolveIgnoresFromGitignore } from 'neostandard';

import { additionalRules } from './base-configs/additional-rules.js';
import { browserFilesConfig } from './base-configs/browser.js';
import { cliToolsConfig } from './base-configs/cli.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { modifiedNeostandardRules } from './base-configs/modified-rules.js';
import { nodeRules } from './base-configs/node.js';
import { perfectionistRules } from './base-configs/perfectionist.js';
import { regexpRules } from './base-configs/regexp.js';

/** @type {ReadonlySet<string>} */
const VALID_OPTIONS = new Set([
  // voxpelli-specific
  'browserFiles', 'cliTools', 'cjs', 'noMocha',
  // neostandard pass-through
  'env', 'files', 'filesTs', 'globals', 'ignores',
  'noJsx', 'noStyle', 'semi', 'ts',
]);

/**
 * @param {{ browserFiles?: string[], cliTools?: string[], cjs?: boolean, noMocha?: boolean } & import('neostandard').NeostandardOptions} [options]
 * @returns {import('eslint').Linter.Config[]}
 */
export function voxpelli (options) {
  if (options) {
    for (const key of Object.keys(options)) {
      if (!VALID_OPTIONS.has(key)) {
        throw new TypeError(
          `voxpelli() received unknown option: "${key}". ` +
          'Custom rules/plugins go in a separate config object: ' +
          '[...voxpelli(), { rules: { ... } }]'
        );
      }
    }
  }

  const {
    browserFiles,
    cjs = false,
    cliTools,
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
    ...perfectionistRules,
    ...noMocha ? [] : mochaRules,
    ...browserFiles?.length ? browserFilesConfig(browserFiles) : [],
    ...cliTools?.length ? cliToolsConfig(cliTools) : [],
  ];
}

export { plugins } from 'neostandard';
export { default as globals } from 'globals';

export default voxpelli();

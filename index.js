import neostandard, { resolveFilePatterns, resolveIgnoresFromGitignore } from 'neostandard';

import { additionalRules, additionalStyleRules } from './base-configs/additional-rules.js';
import { esmRules } from './base-configs/esm.js';
import { jsdocRules } from './base-configs/jsdoc.js';
import { mochaRules } from './base-configs/mocha.js';
import { modifiedNeostandardRules, modifiedNeostandardStyleRules } from './base-configs/modified-rules.js';
import { nodeRules } from './base-configs/node.js';
import { packageJsonRules } from './base-configs/package-json.js';
import { perfectionistRules } from './base-configs/perfectionist.js';
import { regexpRules } from './base-configs/regexp.js';
import { browserFilesConfig } from './profiles/browser.js';
import { cliFilesConfig } from './profiles/cli.js';

/**
 * @import { Linter } from 'eslint'
 * @import { NeostandardOptions } from 'neostandard'
 */

/**
 * @typedef AdditionalOptions
 * @property {string[]} [browserFiles]
 * @property {string[]} [cliFiles]
 * @property {boolean} [noMocha]
 */

/** @typedef {AdditionalOptions & NeostandardOptions} VoxpelliOptions */

/** @satisfies {Record<keyof VoxpelliOptions | 'noMocha', true>} */
const VALID_OPTIONS_MAP = {
  // voxpelli-specific
  browserFiles: true,
  cliFiles: true,
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
 * @returns {Linter.Config[]}
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
    cliFiles,
    files = [],
    filesTs = [],
    ignores: rawIgnores,
    noJsx = true,
    noMocha,
    noStyle,
    semi = true,
    ts = true,
    ...neostandardOptions
  } = options || {};

  const ignores = [
    'coverage/**/*',
    ...resolveIgnoresFromGitignore(),
    ...rawIgnores || [],
  ];

  /** @type {Required<Omit<NeostandardOptions, keyof typeof neostandardOptions>> & typeof neostandardOptions} */
  const resolvedNeostandardOptions = {
    ...neostandardOptions,
    files,
    filesTs,
    ignores,
    noJsx,
    noStyle,
    semi,
    ts,
  };

  const filePatterns = resolveFilePatterns({
    files,
    filesTs,
    ignores,
    noJsx,
    ts,
  });

  const {
    ignores: jsTsIgnores,
    jsTsFiles,
  } = filePatterns;

  const configWithFilePatterns = [
    ...noStyle ? [] : modifiedNeostandardStyleRules,
    ...additionalRules,
    ...noStyle ? [] : additionalStyleRules,
    ...jsdocRules,
    ...regexpRules,
    ...esmRules,
    ...noStyle ? [] : perfectionistRules,
  ].map(config => ({
    ...config,
    files: jsTsFiles,
    ignores: jsTsIgnores,
  }));

  return [
    { name: '@voxpelli/ignores', ignores },
    ...neostandard(resolvedNeostandardOptions),

    ...modifiedNeostandardRules(filePatterns),
    ...nodeRules(filePatterns),

    ...configWithFilePatterns,

    // package-json rules need their own `files: ['**/package.json']` and the
    // jsonc-eslint-parser from `extends`, so they must stay out of the
    // `configWithFilePatterns` map that overwrites `files`/`ignores`.
    ...packageJsonRules,

    ...noMocha ? [] : mochaRules,

    ...browserFiles?.length ? browserFilesConfig(browserFiles, jsTsIgnores) : [],
    ...cliFiles?.length ? cliFilesConfig(cliFiles, jsTsIgnores) : [],
  ];
}

export { plugins } from 'neostandard';
export { default as globals } from 'globals';
export { default as packageJsonPlugin } from 'eslint-plugin-package-json';
export { default as jsoncParser } from 'jsonc-eslint-parser';

export { browserFilesConfig as browserFiles } from './profiles/browser.js';
export { cliFilesConfig as cliFiles } from './profiles/cli.js';

export default voxpelli();

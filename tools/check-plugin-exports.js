// Sanity checker for bundled ESLint plugin config shapes and types.
// Run: node tools/check-plugin-exports.js --help

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { peowly } from 'peowly';

const require = createRequire(import.meta.url);

const { flags } = peowly({
  name: 'check-plugin-exports',
  description: 'Verify bundled ESLint plugin config export shapes and types',
  options: {
    types: {
      type: 'boolean',
      'default': false,
      description: 'Check for bundled types vs unnecessary @types/* packages',
      'short': 't',
    },
  },
});

const withTypes = flags.types;

// --- Plugin definitions ---

/**
 * @typedef PluginDef
 * @property {string} name
 * @property {'default' | string} exportType
 * @property {(value: unknown) => Record<string, boolean>} check
 */

/** @type {PluginDef[]} */
const plugins = [
  {
    name: 'eslint-plugin-unicorn',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'configs.recommended': !!c.configs?.recommended,
      'configs[flat/recommended] (deprecated)': !!c.configs?.['flat/recommended'],
      'configs.unopinionated': !!c.configs?.unopinionated,
    }),
  },
  {
    name: 'eslint-plugin-jsdoc',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'configs[flat/recommended-typescript-flavor]': !!c.configs?.['flat/recommended-typescript-flavor'],
    }),
  },
  {
    name: 'eslint-plugin-mocha',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'configs.recommended': !!c.configs?.recommended,
    }),
  },
  {
    name: 'eslint-plugin-perfectionist',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'has rules': !!c.rules,
      'has configs': !!c.configs,
      'configs.recommended-natural': !!c.configs?.['recommended-natural'],
    }),
  },
  {
    name: 'eslint-plugin-security',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'configs.recommended': !!c.configs?.recommended,
      'recommended is flat object': !Array.isArray(c.configs?.recommended) && typeof c.configs?.recommended === 'object',
    }),
  },
  {
    name: 'eslint-plugin-regexp',
    exportType: 'named:configs',
    check: (/** @type {any} */ c) => ({
      'configs[flat/recommended]': !!c?.['flat/recommended'],
    }),
  },
  {
    name: 'eslint-plugin-es-x',
    exportType: 'default',
    check: (/** @type {any} */ c) => ({
      'has rules': !!c.rules,
      'has configs': !!c.configs,
    }),
  },
];

// --- Helpers ---

/**
 * @param {string} s
 * @returns {string}
 */
const green = (s) => `\u001B[32m${s}\u001B[0m`;
/**
 * @param {string} s
 * @returns {string}
 */
const red = (s) => `\u001B[31m${s}\u001B[0m`;
/**
 * @param {string} s
 * @returns {string}
 */
const dim = (s) => `\u001B[2m${s}\u001B[0m`;

/**
 * @param {string} name
 * @returns {string}
 */
function getVersion (name) {
  // Try the direct subpath first; some packages don't expose package.json in exports
  try {
    const pkgPath = require.resolve(`${name}/package.json`);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return JSON.parse(readFileSync(pkgPath, 'utf8')).version;
  } catch {}

  // Fallback: resolve the main entry and walk up to find package.json
  try {
    let dir = path.dirname(require.resolve(name));
    while (dir !== path.dirname(dir)) {
      const candidate = path.join(dir, 'package.json');
      try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const pkg = JSON.parse(readFileSync(candidate, 'utf8'));
        if (pkg.name === name) return pkg.version;
      } catch {}
      dir = path.dirname(dir);
    }
  } catch {}

  return '?';
}

/** @returns {Promise<string>} */
async function typesyncDry () {
  const { execFile } = await import('node:child_process');
  const { promisify } = await import('node:util');
  const exec = promisify(execFile);
  try {
    const { stdout } = await exec('npx', ['typesync', '--dry'], { cwd: import.meta.dirname + '/..' });
    return stdout;
  } catch {
    return '';
  }
}

// --- Main ---

let ok = true;

console.log('Plugin export shapes:\n');

for (const { check, exportType, name } of plugins) {
  try {
    const mod = /** @type {Record<string, unknown>} */ (await import(name));
    const value = exportType === 'default'
      ? mod['default']
      : (exportType.startsWith('named:')
          ? mod[exportType.slice(6)]
          : mod);

    const version = getVersion(name);
    const results = check(value);
    const allOk = Object.values(results).every(Boolean);

    console.log(`${allOk ? green('✓') : red('✗')} ${name}@${version}`);
    for (const [key, val] of Object.entries(results)) {
      console.log(`  ${val ? '✓' : '✗'} ${key}`);
    }

    if (!allOk) ok = false;
  } catch (err) {
    console.log(`${red('✗')} ${name}: ${/** @type {Error} */ (err).message}`);
    ok = false;
  }
}

if (withTypes) {
  console.log('\nType packages (via typesync --dry):\n');
  const output = await typesyncDry();
  if (output) {
    console.log(output.trim());
  } else {
    console.log(dim('  typesync not available'));
  }
}

if (!ok) {
  console.log(`\n${red('Some checks failed.')}`);
}

process.exit(ok ? 0 : 1);

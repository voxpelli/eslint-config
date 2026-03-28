// Pre-release compatibility checker for canary test repos.
// Scans workflow-external.json repos via GitHub API and reports
// whether they're ready for the next major version.
//
// Usage:
//   node check-compat.js                          # all compliant repos
//   node check-compat.js --tier nonCompliant      # specific tier
//   node check-compat.js --sample 5               # random sample of 5
//   node check-compat.js --json                   # JSON output
//   node check-compat.js --patterns               # list grep pattern registry
//   node check-compat.js --parallel 1             # sequential (for rate limits)

import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';

import { peowly } from 'peowly';

const execFileAsync = promisify(execFile);
const projectRoot = import.meta.dirname + '/..';

// --- ANSI helpers ---

const green = /** @param {string} s */ s => `\u001B[32m${s}\u001B[0m`;
const red = /** @param {string} s */ s => `\u001B[31m${s}\u001B[0m`;
const yellow = /** @param {string} s */ s => `\u001B[33m${s}\u001B[0m`;
const dim = /** @param {string} s */ s => `\u001B[2m${s}\u001B[0m`;
const bold = /** @param {string} s */ s => `\u001B[1m${s}\u001B[0m`;

// --- Pattern registry ---

/**
 * @typedef {{ id: string, description: string, severity: 'error' | 'warn', searchTerm: string, pattern: RegExp, release: string }} PatternEntry
 */

// TODO: If tools/ is extracted into its own package, replace this with
// read-pkg or type-fest's PackageJson for richer types and validation.
/**
 * @typedef PackageJson
 * @property {string} [version]
 * @property {Record<string, string>} [dependencies]
 * @property {Record<string, string>} [devDependencies]
 * @property {Record<string, string>} [peerDependencies]
 * @property {{ node?: string }} [engines]
 */

/** @type {PatternEntry[]} */
const PATTERN_REGISTRY = [
  {
    id: 'no-instanceof-builtins',
    description: 'instanceof on built-in constructors',
    severity: 'error',
    searchTerm: 'instanceof Array OR instanceof Map OR instanceof Set',
    pattern: /\binstanceof\s+(Array|Map|Set|WeakMap|WeakSet|RegExp|Promise)\b/,
    release: 'v25',
  },
  {
    id: 'consistent-date-clone',
    description: 'new Date(variable) instead of structuredClone',
    severity: 'error',
    searchTerm: 'new Date(',
    pattern: /new Date\([a-zA-Z_$][\w$.]*\)/,
    release: 'v25',
  },
  {
    id: 'no-unnecessary-array-flat-depth',
    description: '.flat(1) — default depth is redundant',
    severity: 'error',
    searchTerm: '.flat(1)',
    pattern: /\.flat\(\s*1\s*\)/,
    release: 'v25',
  },
  {
    id: 'no-useless-error-capture-stack-trace',
    description: 'Error.captureStackTrace in subclass constructor',
    severity: 'error',
    searchTerm: 'Error.captureStackTrace',
    pattern: /Error\.captureStackTrace\b/,
    release: 'v25',
  },
  {
    id: 'no-named-default',
    description: 'import { default as X } — use default import',
    severity: 'error',
    searchTerm: 'import { default as',
    pattern: /import\s*\{[^}]*\bdefault\s+as\b[^}]*\}/,
    release: 'v25',
  },
  {
    id: 'no-array-sort',
    description: '.sort() without comparator',
    severity: 'warn',
    searchTerm: '.sort()',
    pattern: /\.sort\(\s*\)/,
    release: 'v25',
  },
  {
    id: 'no-array-reverse',
    description: '.reverse() mutates in place',
    severity: 'warn',
    searchTerm: '.reverse()',
    pattern: /\.reverse\(\s*\)/,
    release: 'v25',
  },
  {
    id: 'eslint-env-comments',
    description: '/* eslint-env */ comments (errors in ESLint v10)',
    severity: 'error',
    searchTerm: 'eslint-env',
    pattern: /\/\*\s*eslint-env\b/,
    release: 'v26',
  },
];

// --- GitHub API ---

/**
 * @param {string} path
 * @returns {Promise<unknown>}
 */
async function ghApi (path) {
  try {
    const { stdout } = await execFileAsync('gh', ['api', path, '-H', 'Accept: application/vnd.github.raw+json'], { maxBuffer: 1024 * 1024 });
    return stdout;
  } catch (err) {
    if (/** @type {{ stderr?: string }} */ (err).stderr?.includes('404')) return;
    throw err;
  }
}

/**
 * @param {string} query
 * @returns {Promise<Array<{ path: string, textMatches: Array<{ fragment: string }> }>>}
 */
async function ghSearchCode (query) {
  try {
    const { stdout } = await execFileAsync('gh', [
      'api', 'search/code',
      '-X', 'GET',
      '-f', `q=${query}`,
      '--jq', '.items[:10] | map({path: .path, textMatches: .text_matches | map({fragment: .fragment})})',
    ], { maxBuffer: 1024 * 1024 });
    return JSON.parse(stdout);
  } catch {
    return [];
  }
}

// --- Collect ---

/**
 * @typedef {{ slug: string, packageJson: Record<string, unknown> | undefined, eslintConfig: string | undefined, eslintConfigFile: string | undefined, patternHits: Array<{ id: string, description: string, severity: string, count: number }> }} RawRepoData
 */

/**
 * @param {string} slug
 * @param {PatternEntry[]} patterns
 * @returns {Promise<RawRepoData>}
 */
async function collectRepo (slug, patterns) {
  const [pkgRaw, configJs, configMjs] = await Promise.all([
    ghApi(`repos/${slug}/contents/package.json`),
    ghApi(`repos/${slug}/contents/eslint.config.js`),
    ghApi(`repos/${slug}/contents/eslint.config.mjs`),
  ]);

  /** @type {Record<string, unknown> | undefined} */
  let packageJson;
  if (typeof pkgRaw === 'string') {
    try { packageJson = JSON.parse(pkgRaw); } catch {}
  }

  const eslintConfig = /** @type {string | undefined} */ (configJs ?? configMjs);
  const eslintConfigFile = configJs ? 'eslint.config.js' : (configMjs ? 'eslint.config.mjs' : undefined);

  // Search for patterns (grouped by searchTerm to reduce API calls)
  /** @type {Map<string, PatternEntry[]>} */
  const searchGroups = new Map();
  for (const p of patterns) {
    const existing = searchGroups.get(p.searchTerm) ?? [];
    existing.push(p);
    searchGroups.set(p.searchTerm, existing);
  }

  /** @type {RawRepoData['patternHits']} */
  const patternHits = [];

  for (const [searchTerm, entries] of searchGroups) {
    const query = `${searchTerm} repo:${slug} language:JavaScript`;
    const results = await ghSearchCode(query);
    const allFragments = results.flatMap(r => r.textMatches?.map(m => m.fragment) ?? []);

    for (const entry of entries) {
      const count = allFragments.filter(f => entry.pattern.test(f)).length;
      if (count > 0) {
        patternHits.push({ id: entry.id, description: entry.description, severity: entry.severity, count });
      }
    }
  }

  return { slug, packageJson, eslintConfig, eslintConfigFile, patternHits };
}

// --- Analyze ---

/**
 * @typedef {{ slug: string, status: 'ready' | 'needs-eslint-bump' | 'risky' | 'unknown', eslintVersion: string | undefined, eslintVersionOk: boolean, configStyle: string, nodeEngines: string | undefined, currentConfigVersion: string | undefined, patternHits: RawRepoData['patternHits'], errors: string[] }} RepoResult
 */

/**
 * @param {RawRepoData} raw
 * @param {{ peerEslintMin: number[] }} localConfig
 * @returns {RepoResult}
 */
function analyzeRepo (raw, localConfig) {
  /** @type {string[]} */
  const errors = [];

  // ESLint version
  const pkg = /** @type {PackageJson | undefined} */ (raw.packageJson);
  const devDeps = pkg?.devDependencies ?? {};
  const eslintVersion = devDeps['eslint'];
  let eslintVersionOk = false;

  if (eslintVersion) {
    const match = eslintVersion.match(/(\d+)\.(\d+)\.(\d+)/);
    if (match) {
      const [major, minor, patch] = [Number(match[1]), Number(match[2]), Number(match[3])];
      const reqMajor = /** @type {number} */ (localConfig.peerEslintMin[0]);
      const reqMinor = /** @type {number} */ (localConfig.peerEslintMin[1]);
      const reqPatch = /** @type {number} */ (localConfig.peerEslintMin[2]);
      eslintVersionOk = major > reqMajor ||
        (major === reqMajor && minor > reqMinor) ||
        (major === reqMajor && minor === reqMinor && patch >= reqPatch);
    }
  }

  // Config style
  let configStyle = 'unknown';
  if (!raw.eslintConfig) {
    configStyle = 'missing';
  } else if (/export\s*\{\s*default\s*\}\s*from\s*['"]@voxpelli\/eslint-config['"]/.test(raw.eslintConfig)) {
    configStyle = 'bare-reexport';
  } else if (/@voxpelli\/eslint-config/.test(raw.eslintConfig)) {
    configStyle = 'custom-overrides';
  }

  // Node engines
  const nodeEngines = pkg?.engines?.node;

  // Current config version
  const currentConfigVersion = devDeps['@voxpelli/eslint-config'];

  // Status
  const hasErrorPatterns = raw.patternHits.some(p => p.severity === 'error');
  let status = /** @type {RepoResult['status']} */ ('ready');
  if (!raw.packageJson) {
    status = 'unknown';
  } else if (!eslintVersionOk) {
    status = 'needs-eslint-bump';
  } else if (hasErrorPatterns) {
    status = 'risky';
  }

  return {
    slug: raw.slug,
    status,
    eslintVersion,
    eslintVersionOk,
    configStyle,
    nodeEngines,
    currentConfigVersion,
    patternHits: raw.patternHits,
    errors,
  };
}

// --- Report ---

/** @param {RepoResult[]} results */
function renderTerminal (results) {
  const statusIcon = /** @param {string} s */ s => {
    if (s === 'ready') return green('✓');
    if (s === 'needs-eslint-bump') return yellow('△');
    if (s === 'risky') return red('✗');
    return dim('?');
  };

  for (const r of results) {
    const dots = '.'.repeat(Math.max(1, 50 - r.slug.length));
    console.log(`${statusIcon(r.status)} ${r.slug} ${dim(dots)} ${r.status}`);
    console.log(`    ESLint    ${r.eslintVersion ?? 'unknown'}  ${r.eslintVersionOk ? green('ok') : red('NEEDS BUMP')}`);
    console.log(`    Config    ${r.configStyle}`);
    console.log(`    Node      ${r.nodeEngines ?? 'unknown'}`);
    console.log(`    @voxpelli ${r.currentConfigVersion ?? 'unknown'}`);

    if (r.patternHits.length > 0) {
      console.log('    Patterns:');
      for (const h of r.patternHits) {
        const sev = h.severity === 'error' ? red(h.severity) : yellow(h.severity);
        console.log(`      ${sev} ${h.id}: ${h.count} hit${h.count === 1 ? '' : 's'}`);
      }
    } else {
      console.log(`    Patterns  ${dim('no hits')}`);
    }
    console.log();
  }

  // Summary
  const counts = { ready: 0, 'needs-eslint-bump': 0, risky: 0, unknown: 0 };
  for (const r of results) counts[r.status]++;

  console.log(bold('Summary'));
  console.log(`  ${green('ready')}              ${counts.ready}`);
  console.log(`  ${yellow('needs-eslint-bump')}  ${counts['needs-eslint-bump']}`);
  console.log(`  ${red('risky')}              ${counts.risky}`);
  console.log(`  ${dim('unknown')}            ${counts.unknown}`);
}

/** @param {RepoResult[]} results */
function renderJson (results) {
  const localPkg = /** @type {PackageJson} */ (JSON.parse(readFileSync(`${projectRoot}/package.json`, 'utf8')));
  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    localConfigVersion: localPkg.version,
    peerEslintRange: localPkg.peerDependencies?.['eslint'],
    repos: results,
    summary: {
      ready: results.filter(r => r.status === 'ready').length,
      needsEslintBump: results.filter(r => r.status === 'needs-eslint-bump').length,
      risky: results.filter(r => r.status === 'risky').length,
      unknown: results.filter(r => r.status === 'unknown').length,
    },
  }, undefined, 2));
}

// --- Repo selection ---

/**
 * @param {Record<string, string[]>} tiers
 * @param {string} tierName
 * @param {number | undefined} sampleN
 * @returns {string[]}
 */
function selectRepos (tiers, tierName, sampleN) {
  const repos = tiers[tierName];
  if (!repos) {
    console.error(`Unknown tier: ${tierName}. Available: ${Object.keys(tiers).join(', ')}`);
    process.exit(1);
  }
  if (!sampleN || sampleN >= repos.length) return [...repos];

  // Fisher-Yates partial shuffle
  const arr = [...repos];
  for (let i = 0; i < sampleN; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    const a = /** @type {string} */ (arr[i]);
    const b = /** @type {string} */ (arr[j]);
    arr[i] = b;
    arr[j] = a;
  }
  return arr.slice(0, sampleN);
}

// --- Semaphore ---

/**
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} concurrency
 * @returns {Promise<T[]>}
 */
async function parallel (tasks, concurrency) {
  /** @type {T[]} */
  const results = [];
  let i = 0;

  async function worker () {
    while (i < tasks.length) {
      const idx = i++;
      const task = tasks[idx];
      if (task) results[idx] = await task();
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()));
  return results;
}

// --- Main ---

async function main () {
  const { flags } = peowly({
    name: 'check-compat',
    description: 'Pre-release compatibility checker for canary test repos',
    options: {
      tier: {
        type: 'string',
        'default': 'compliant',
        description: 'Tier to check (compliant, preFlatconfigCompliant, nonCompliant)',
      },
      sample: {
        type: 'string',
        description: 'Random sample of N repos',
      },
      parallel: {
        type: 'string',
        'default': '3',
        description: 'Max concurrent repos',
      },
      json: {
        type: 'boolean',
        'default': false,
        description: 'JSON output',
      },
      patterns: {
        type: 'boolean',
        'default': false,
        description: 'List grep pattern registry and exit',
      },
    },
  });

  if (flags.patterns) {
    console.log(bold('Pattern Registry\n'));
    for (const p of PATTERN_REGISTRY) {
      const sev = p.severity === 'error' ? red(p.severity) : yellow(p.severity);
      console.log(`  ${p.id} ${dim(`[${p.release}]`)} ${sev}`);
      console.log(`    ${p.description}`);
      console.log(`    ${dim(String(p.pattern))}`);
      console.log();
    }
    process.exit(0);
  }

  // Check gh auth
  try {
    await execFileAsync('gh', ['auth', 'status']);
  } catch {
    console.error(red('Error: gh is not authenticated. Run `gh auth login` first.'));
    process.exit(1);
  }

  const tierName = flags.tier;
  const sampleN = flags.sample ? Number(flags.sample) : undefined;
  const concurrency = Number(flags.parallel);
  const jsonOutput = flags.json;

  // Load local config
  const localPkg = /** @type {PackageJson} */ (JSON.parse(readFileSync(`${projectRoot}/package.json`, 'utf8')));
  const peerRange = localPkg.peerDependencies?.['eslint'] ?? '^9.0.0';
  const peerMatch = peerRange.match(/(\d+)\.(\d+)\.(\d+)/);
  const peerEslintMin = peerMatch ? [Number(peerMatch[1]), Number(peerMatch[2]), Number(peerMatch[3])] : [9, 0, 0];

  // Load repo list
  const tiers = /** @type {Record<string, string[]>} */ (JSON.parse(readFileSync(`${projectRoot}/workflow-external.json`, 'utf8')));
  const repos = selectRepos(tiers, tierName, sampleN);

  if (!jsonOutput) {
    console.log(`${bold('check-compat')} — ${repos.length} repos (${tierName} tier)${sampleN ? ` [sample of ${sampleN}]` : ''}\n`);
  }

  // Collect and analyze
  const activePatterns = PATTERN_REGISTRY;
  const tasks = repos.map(slug => () => collectRepo(slug, activePatterns));
  const rawResults = await parallel(tasks, concurrency);
  const results = rawResults.map(raw => analyzeRepo(raw, { peerEslintMin }));

  // Report
  if (jsonOutput) {
    renderJson(results);
  } else {
    renderTerminal(results);
  }

  const hasIssues = results.some(r => r.status === 'risky' || r.status === 'needs-eslint-bump');
  process.exit(hasIssues ? 1 : 0);
}

try {
  await main();
} catch (err) {
  console.error(red(`Fatal: ${/** @type {Error} */ (err).message}`));
  process.exit(1);
}

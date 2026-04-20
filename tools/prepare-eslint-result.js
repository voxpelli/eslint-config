// @ts-check
/* eslint-disable n/no-sync, unicorn/no-process-exit */

// Aggregate one project's ESLint JSON output into a compact summary.
// Reads project/eslint-results.json; writes eslint-result.json when there
// are any errors or warnings. No-ruleId messages go to synthetic buckets
// ((parser error) / (no rule id) / (invalid rule id)) so the per-rule
// totals reconcile with the file-level totals.

import fs from 'node:fs';
import path from 'node:path';

const projectPrefix = path.resolve('project') + '/';
// eslint-disable-next-line n/no-process-env
const project = process.env['PROJECT'] ?? '';

/** @type {unknown} */
let raw;
try {
  raw = JSON.parse(fs.readFileSync('project/eslint-results.json', 'utf8'));
} catch {
  process.exit(0);
}
if (!Array.isArray(raw)) process.exit(0);

/** @typedef {{ errors: number, warnings: number, fixable: number, files: string[] }} RuleBucket */

const totals = { errorCount: 0, warningCount: 0, fixableErrorCount: 0, fixableWarningCount: 0 };
/** @type {Record<string, RuleBucket>} */
const rules = {};
/** @type {string[]} */
const syntheticKeys = [];

for (const file of raw) {
  if (!file || typeof file !== 'object' || Array.isArray(file)) continue;
  totals.errorCount += Math.trunc(file.errorCount);
  totals.warningCount += Math.trunc(file.warningCount);
  totals.fixableErrorCount += Math.trunc(file.fixableErrorCount);
  totals.fixableWarningCount += Math.trunc(file.fixableWarningCount);
  if (!Array.isArray(file.messages)) continue;

  for (const msg of file.messages) {
    if (!msg || typeof msg !== 'object') continue;

    /** @type {string} */
    let key;
    if (msg.fatal === true) {
      key = '(parser error)';
    } else if (!msg.ruleId) {
      key = '(no rule id)';
    } else if (typeof msg.ruleId === 'string' && /^[@\w/-]+$/.test(msg.ruleId)) {
      key = msg.ruleId;
    } else {
      key = '(invalid rule id)';
    }

    if (key.startsWith('(') && !syntheticKeys.includes(key)) syntheticKeys.push(key);

    let bucket = rules[key];
    if (!bucket) {
      bucket = { errors: 0, warnings: 0, fixable: 0, files: [] };
      rules[key] = bucket;
    }
    if (msg.severity === 2) bucket.errors++;
    else bucket.warnings++;
    if (msg.fix) bucket.fixable++;

    const cleanPath = typeof file.filePath === 'string' && file.filePath.startsWith(projectPrefix)
      ? file.filePath.slice(projectPrefix.length)
      : '<unexpected path>';
    bucket.files.push(cleanPath + ':' + msg.line);
  }
}

if (totals.errorCount === 0 && totals.warningCount === 0) process.exit(0);
fs.writeFileSync('eslint-result.json', JSON.stringify({ project, ...totals, syntheticKeys, rules }));

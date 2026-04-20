// @ts-check

// Aggregate one project's ESLint JSON output into a compact summary.
// Reads project/eslint-results.json; writes eslint-result.json when there
// are any errors or warnings. No-ruleId messages go to synthetic buckets
// ((parser error) / (no rule id) / (invalid rule id)) so the per-rule
// totals reconcile with the file-level totals.

import fs from 'node:fs';
import path from 'node:path';

const projectPrefix = path.resolve('project') + '/';

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
  totals.errorCount += Math.trunc(Number(file.errorCount)) || 0;
  totals.warningCount += Math.trunc(Number(file.warningCount)) || 0;
  totals.fixableErrorCount += Math.trunc(Number(file.fixableErrorCount)) || 0;
  totals.fixableWarningCount += Math.trunc(Number(file.fixableWarningCount)) || 0;
  if (!Array.isArray(file.messages)) continue;

  for (const msg of file.messages) {
    if (!msg || typeof msg !== 'object') continue;

    const msgText = typeof msg.message === 'string' ? msg.message : '';

    // Detect ESLint meta-messages so they don't masquerade as real rule violations.
    // Unused eslint-disable directive (no problems were reported from 'n/…')
    const unusedDisableMatch = /\(no problems were reported from '([^']{1,200})'\)/.exec(msgText);
    // Definition for rule '<rule>' was not found
    const missingRuleMatch = !unusedDisableMatch && /^Definition for rule '([^']{1,200})' was not found/.exec(msgText);

    /** @type {string} */
    let key;
    /** @type {string} */
    let detail = '';
    if (msg.fatal === true) {
      key = '(parser error)';
    } else if (unusedDisableMatch) {
      key = '(unused disable)';
      detail = unusedDisableMatch[1] ?? '';
    } else if (missingRuleMatch) {
      key = '(missing rule)';
      detail = missingRuleMatch[1] ?? '';
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
    const fileEntry = cleanPath + ':' + (msg.line ?? '?') + (detail ? '\t' + detail : '');
    bucket.files.push(fileEntry);
  }
}

if (totals.errorCount === 0 && totals.warningCount === 0) process.exit(0);
fs.writeFileSync('eslint-result.json', JSON.stringify({ project, ...totals, syntheticKeys, rules }));

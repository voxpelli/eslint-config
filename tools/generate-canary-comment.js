// @ts-check

// Assemble the external-canary sticky comment markdown from per-project
// result artifacts. Reads results/*/eslint-result.json; writes comment.md.
// On clean runs (no result files), emits a positive confirmation that
// includes the total project count from env EXTERNAL_PROJECT_COUNT.

import fs from 'node:fs';
import path from 'node:path';

/** @typedef {{ errors: number, warnings: number, fixable: number, files: string[] }} RuleBucket */

const BIDI_ZW_CTRL = /[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g;
/** @param {unknown} s */
const stripCtrl = (s) => String(s).replace(BIDI_ZW_CTRL, '');
/** @param {unknown} s */
const escapeHtml = (s) => stripCtrl(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const FILE_CAP = 50;
const SIZE_CAP = 60_000;

const externalCount = Number(process.env['EXTERNAL_PROJECT_COUNT'] ?? 0);

const dir = 'results';
/** @type {Array<Record<string, unknown>>} */
const results = [];
if (fs.existsSync(dir)) {
  for (const sub of fs.readdirSync(dir)) {
    const file = path.join(dir, sub, 'eslint-result.json');
    if (!fs.existsSync(file)) continue;
    if (fs.statSync(file).size > 5 * 1024 * 1024) continue;
    /** @type {unknown} */
    let parsed;
    try { parsed = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) continue;
    const p = /** @type {Record<string, unknown>} */ (parsed);
    if (p['rules'] && (typeof p['rules'] !== 'object' || Array.isArray(p['rules']))) continue;
    results.push(p);
  }
}
results.sort((a, b) => String(a['project']).localeCompare(String(b['project'])));

if (results.length === 0) {
  const n = externalCount > 0 ? String(externalCount) : '?';
  fs.writeFileSync('comment.md',
    `## External project test results\n\n:white_check_mark: All ${n} external projects pass\n`);
  process.exit(0);
}

const hasSyntheticFootnote = results.some(r => {
  const sk = r['syntheticKeys'];
  return Array.isArray(sk) && sk.some(k => k === '(parser error)' || k === '(no rule id)');
});

const totalErrors    = results.reduce((s, r) => s + ((Number(r['errorCount'])          | 0)), 0);
const totalWarnings  = results.reduce((s, r) => s + ((Number(r['warningCount'])        | 0)), 0);
const totalFixableE  = results.reduce((s, r) => s + ((Number(r['fixableErrorCount'])   | 0)), 0);
const totalFixableW  = results.reduce((s, r) => s + ((Number(r['fixableWarningCount']) | 0)), 0);

let md = '## External project test results\n\n';
md += '**' + results.length + ' project(s) reported issues**';
if (totalErrors > 0)   md += ' &mdash; ' + totalErrors + ' errors (' + totalFixableE + ' fixable)';
if (totalWarnings > 0) md += ', ' + totalWarnings + ' warnings (' + totalFixableW + ' fixable)';
md += '\n\n';

if (hasSyntheticFootnote) {
  md += '<sub><em><code>(parser error)</code> — ESLint reported a fatal parse/syntax error without a rule id.<br>';
  md += '<code>(no rule id)</code> — ESLint reported a non-fatal issue without attributing it to a named rule.</em></sub>\n\n';
}

for (const r of results) {
  const slug = String(r['project']);
  const isValidSlug = /^[\w.-]+\/[\w.-]+$/.test(slug);
  const label = isValidSlug
    ? '<a href="https://github.com/' + slug + '"><code>' + escapeHtml(slug) + '</code></a>'
    : escapeHtml(slug);

  const errorCount   = Number(r['errorCount'])   | 0;
  const warningCount = Number(r['warningCount']) | 0;
  const fixable      = (Number(r['fixableErrorCount']) | 0) + (Number(r['fixableWarningCount']) | 0);
  const fixStr = fixable > 0 ? ' (' + fixable + ' fixable :wrench:)' : '';

  md += '<details>\n<summary>' + label + ' &mdash; ' + errorCount + ' errors, ' + warningCount + ' warnings' + fixStr + '</summary>\n\n';
  md += '| Errors | Warnings | Fixable | Rule |\n';
  md += '|-------:|---------:|--------:|------|\n';

  const rulesObj = r['rules'] && typeof r['rules'] === 'object' && !Array.isArray(r['rules'])
    ? /** @type {Record<string, RuleBucket>} */ (r['rules'])
    : {};

  const ruleEntries = Object.entries(rulesObj)
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.errors - a.errors || b.warnings - a.warnings || a.id.localeCompare(b.id));

  for (const rule of ruleEntries) {
    const shownFiles = (rule.files || []).slice(0, FILE_CAP);
    const overflow = (rule.files || []).length - shownFiles.length;

    const fileSpans = shownFiles.map(f => {
      const m = /^(.+):(\d+)$/.exec(f);
      if (m && isValidSlug) {
        const [, filePath, line] = m;
        return '<a href="https://github.com/' + slug + '/blob/HEAD/' + encodeURI(filePath ?? '') + '#L' + line + '"><code>' + escapeHtml(f) + '</code></a>';
      }
      return '<code>' + escapeHtml(f) + '</code>';
    });

    const fileBlock = fileSpans.join('<br>') + (overflow > 0 ? '<br><em>... and ' + overflow + ' more</em>' : '');
    const fixCol = rule.fixable > 0 ? rule.fixable + ' :wrench:' : '-';
    md += '| ' + rule.errors + ' | ' + rule.warnings + ' | ' + fixCol + ' | <details><summary><code>' + escapeHtml(rule.id) + '</code></summary>' + fileBlock + '</details> |\n';
  }
  md += '\n</details>\n\n';
}

if (Buffer.byteLength(md, 'utf8') > SIZE_CAP) {
  md = md.slice(0, SIZE_CAP - 5000) + '\n\n_(comment truncated — too many failures to render)_\n';
}
fs.writeFileSync('comment.md', md);

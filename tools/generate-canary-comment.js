// @ts-check

// Assemble the external-canary sticky comment markdown from per-project
// result artifacts. Reads results/*/eslint-result.json; writes comment.md.
// On clean runs (no result files), emits a positive confirmation that
// includes the total project count from env EXTERNAL_PROJECT_COUNT.

import fs from 'node:fs';
import path from 'node:path';

/** @typedef {{ errors: number, warnings: number, fixable: number, files: string[] }} RuleBucket */

const BIDI_ZW_CTRL = /[\u200B-\u200F\u202A-\u202E\u2060-\u2069\uFEFF]/g;
/**
 * @param {unknown} s
 * @returns {string}
 */
const stripCtrl = (s) => String(s).replaceAll(BIDI_ZW_CTRL, '');
/**
 * @param {unknown} s
 * @returns {string}
 */
const escapeHtml = (s) => stripCtrl(s)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll('\'', '&#39;');

const FILE_CAP = 50;
const SIZE_CAP = 60_000;

const externalCount = Number(process.env['EXTERNAL_PROJECT_COUNT'] ?? 0);

const dir = 'results';
/** @type {Array<Record<string, unknown>>} */
const results = [];
if (fs.existsSync(dir)) {
  for (const sub of fs.readdirSync(dir)) {
    const file = path.join(dir, sub, 'eslint-result.json');
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!fs.existsSync(file)) continue;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.statSync(file).size > 5 * 1024 * 1024) continue;
    /** @type {unknown} */
    let parsed;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
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

const SYNTHETIC_FOOTNOTE_KEYS = new Set([
  '(parser error)',
  '(no rule id)',
  '(unused disable)',
  '(missing rule)',
]);

const presentSyntheticKeys = new Set(
  results.flatMap(r => Array.isArray(r['syntheticKeys']) ? r['syntheticKeys'] : [])
    .filter(k => SYNTHETIC_FOOTNOTE_KEYS.has(String(k)))
);
const hasSyntheticFootnote = presentSyntheticKeys.size > 0;

const totalErrors = results.reduce((s, r) => s + Math.trunc(Number(r['errorCount'])), 0);
const totalWarnings = results.reduce((s, r) => s + Math.trunc(Number(r['warningCount'])), 0);
const totalFixableE = results.reduce((s, r) => s + Math.trunc(Number(r['fixableErrorCount'])), 0);
const totalFixableW = results.reduce((s, r) => s + Math.trunc(Number(r['fixableWarningCount'])), 0);

let md = '## External project test results\n\n';
md += '**' + results.length + ' project(s) reported issues**';
if (totalErrors > 0) md += ' &mdash; ' + totalErrors + ' errors (' + totalFixableE + ' fixable)';
if (totalWarnings > 0) md += ', ' + totalWarnings + ' warnings (' + totalFixableW + ' fixable)';
md += '\n\n';

if (hasSyntheticFootnote) {
  /** @type {Record<string, string>} */
  const FOOTNOTE_TEXT = {
    '(parser error)': 'ESLint reported a fatal parse/syntax error without a rule id.',
    '(no rule id)': 'ESLint reported a non-fatal issue without attributing it to a named rule.',
    '(unused disable)': 'An <code>eslint-disable</code> directive reported no matching problems — the named rule is shown next to each file.',
    '(missing rule)': 'An <code>eslint-disable</code> / config references a rule ESLint could not load (plugin uninstalled or rule removed) — the name is shown next to each file.',
  };
  const lines = [...presentSyntheticKeys].toSorted().map(k => '<code>' + escapeHtml(k) + '</code> — ' + FOOTNOTE_TEXT[String(k)]);
  md += '<sub><em>' + lines.join('<br>') + '</em></sub>\n\n';
}

for (const r of results) {
  const slug = String(r['project']);
  const isValidSlug = /^[\w.-]+\/[\w.-]+$/.test(slug);
  const label = isValidSlug
    ? '<a href="https://github.com/' + slug + '"><code>' + escapeHtml(slug) + '</code></a>'
    : escapeHtml(slug);

  const errorCount = Math.trunc(Number(r['errorCount']));
  const warningCount = Math.trunc(Number(r['warningCount']));
  const fixable = Math.trunc(Number(r['fixableErrorCount'])) + Math.trunc(Number(r['fixableWarningCount']));
  const fixStr = fixable > 0 ? ' (' + fixable + ' fixable :wrench:)' : '';

  md += '<details>\n<summary>' + label + ' &mdash; ' + errorCount + ' errors, ' + warningCount + ' warnings' + fixStr + '</summary>\n\n';
  md += '| Errors | Warnings | Fixable | Rule |\n';
  md += '|-------:|---------:|--------:|------|\n';

  const rulesObj = r['rules'] && typeof r['rules'] === 'object' && !Array.isArray(r['rules'])
    ? /** @type {Record<string, RuleBucket>} */ (r['rules'])
    : {};

  const ruleEntries = Object.entries(rulesObj)
    .map(([id, d]) => ({ id, ...d }))
    .toSorted((a, b) => b.errors - a.errors || b.warnings - a.warnings || a.id.localeCompare(b.id));

  for (const rule of ruleEntries) {
    const shownFiles = (rule.files || []).slice(0, FILE_CAP);
    const overflow = (rule.files || []).length - shownFiles.length;

    const fileSpans = shownFiles.map(f => {
      const [pathAndLine, detail] = f.split('\t', 2);
      const m = /^(.+):(\d+)$/.exec(pathAndLine ?? '');
      const detailSuffix = detail ? ' <sub>' + escapeHtml(detail) + '</sub>' : '';
      if (m && isValidSlug) {
        const [, filePath, line] = m;
        const encodedPath = (filePath ?? '').split('/').map(seg => encodeURIComponent(seg)).join('/');
        return '<a href="https://github.com/' + slug + '/blob/HEAD/' + encodedPath + '#L' + line + '"><code>' + escapeHtml(pathAndLine ?? '') + '</code></a>' + detailSuffix;
      }
      return '<code>' + escapeHtml(pathAndLine ?? '') + '</code>' + detailSuffix;
    });

    const fileBlock = fileSpans.join('<br>') + (overflow > 0 ? '<br><em>... and ' + overflow + ' more</em>' : '');
    const fixCol = rule.fixable > 0 ? rule.fixable + ' :wrench:' : '-';
    md += '| ' + rule.errors + ' | ' + rule.warnings + ' | ' + fixCol + ' | <details><summary><code>' + escapeHtml(rule.id) + '</code></summary>' + fileBlock + '</details> |\n';
  }
  md += '\n</details>\n\n';
}

if (Buffer.byteLength(md, 'utf8') > SIZE_CAP) {
  // Truncate at the last `</details>\n\n` boundary before the cap so we
  // never leave an unclosed <details> tag mid-render.
  const slice = md.slice(0, SIZE_CAP - 5000);
  const lastClose = slice.lastIndexOf('</details>\n\n');
  const safeEnd = lastClose !== -1 ? lastClose + '</details>\n\n'.length : slice.length;
  md = slice.slice(0, safeEnd) + '\n\n_(comment truncated — too many failures to render)_\n';
}
fs.writeFileSync('comment.md', md);

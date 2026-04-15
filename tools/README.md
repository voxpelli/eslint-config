# tools/

Dev utilities for maintaining this package. Not published — run from the repo root with `node tools/<script>`.

## check-plugin-exports.js

Sanity-checks that every bundled ESLint plugin exposes the config shapes this package depends on (e.g. `configs.recommended`, `configs['flat/recommended']`).

```bash
node tools/check-plugin-exports.js          # check config export shapes
node tools/check-plugin-exports.js --types  # also check for bundled types vs @types/* packages
```

Run this after upgrading a plugin to confirm the exports haven't changed shape.

## check-compat.js

Pre-release compatibility checker. Scans the canary repos listed in `workflow-external.json` via the GitHub API and reports whether each repo is ready for the next major version.

```bash
node tools/check-compat.js                   # all compliant repos
node tools/check-compat.js --tier compliant  # specific tier (compliant / preFlatconfigCompliant / nonCompliant)
node tools/check-compat.js --sample 5        # random sample of 5 repos
node tools/check-compat.js --json            # JSON output
node tools/check-compat.js --patterns        # list the grep pattern registry
node tools/check-compat.js --parallel 1      # sequential mode (for API rate limits)
```

Run this before cutting a release to spot-check downstream impact.

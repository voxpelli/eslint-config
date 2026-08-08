# Migration guide

This guide covers breaking changes when upgrading `@voxpelli/eslint-config`.

## Upcoming

### Requires a newer Node.js version

#### What broke

Node.js 20 is no longer supported. This package now requires Node.js `^22.13.0 || >=24.0.0`.

#### How to migrate

Upgrade local development, CI, and deployment runtimes to Node.js 22.13.0 or later in the 22.x line, or Node.js 24.0.0 or later.

### Changed JavaScript and TypeScript defaults

#### What broke

JSX files are no longer included by default: `noJsx` now defaults to `true`. Semicolons and TypeScript remain enabled by default through `semi: true` and `ts: true`.

#### How to migrate

If your project lints JSX, pass `noJsx: false` to `voxpelli()`. Set `semi` or `ts` explicitly only when overriding their enabled defaults, for example `semi: false` or `ts: false`.

### Removed CommonJS option

#### What broke

The `cjs` option has been removed. ESM is now the expected standard mode for all users. Mocha linting remains bundled and enabled by default; use `noMocha: true` to disable it. The standalone `browserFiles()` and `cliFiles()` factories now also require an `ignores` argument.

#### How to migrate

1. Remove `cjs` from `voxpelli()` options. `.cjs` files receive the script Node.js configuration automatically.
2. When using standalone profile factories, pass your base configuration's ignore patterns: `browserFiles(globs, ignores)` and `cliFiles(globs, ignores)`.

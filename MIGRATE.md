# Migration guide

This guide covers breaking changes when upgrading `@voxpelli/eslint-config`.

## Upcoming

### Removed CommonJS and Mocha options

#### What broke

The `cjs` and `noMocha` options have been removed from `voxpelli()`. ESM is now the expected standard mode for all users. The bundled Mocha configuration (and its `eslint-plugin-mocha` dependency) has been removed. The standalone `browserFiles()` and `cliFiles()` factories now also require an `ignores` argument.

#### How to migrate

1. Remove `cjs` and `noMocha` from `voxpelli()` options. `.cjs` files receive the script Node.js configuration automatically.
2. If you need Mocha linting, add and configure `eslint-plugin-mocha` in your project's ESLint config.
3. When using standalone profile factories, pass your base configuration's ignore patterns: `browserFiles(globs, ignores)` and `cliFiles(globs, ignores)`.

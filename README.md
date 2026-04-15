# @voxpelli/eslint-config

[![npm version](https://img.shields.io/npm/v/@voxpelli/eslint-config.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/eslint-config.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/eslint-config)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

My personal [ESLint](https://eslint.org/) config – a superset of the [neostandard](https://github.com/neostandard/neostandard) base config that I co-created and co-maintain.

This config contains a couple of more opinionated checks that I find helpful in my projects.

This is also the reference ESLint config for the [types-in-JS](https://github.com/voxpelli/types-in-js) workflow — JavaScript with JSDoc type annotations validated by `tsc`. The JSDoc rules are specifically tuned for this approach: type-checking rules are deactivated (handled by `tsc`), while documentation-oriented JSDoc rules remain active.

## Install

To easily install correct peer dependencies, you can use [`install-peerdeps`](https://www.npmjs.com/package/install-peerdeps):

```bash
install-peerdeps --dev @voxpelli/eslint-config
```

## Usage

Add an `eslint.config.js` (or `eslint.config.mjs` if your project is CJS) that exports this config:

```js
export { default } from '@voxpelli/eslint-config';
```

If you need to configure something, instead do:

```js
import { voxpelli } from '@voxpelli/eslint-config';

export default voxpelli({
  cjs: true,            // Ensures the config has rules fit for a CJS context rather than an ESM context
  noMocha: true,        // By standard this config expects tests to be of the Mocha kind, but one can opt out
  noStyle: true,        // Disables all stylistic rules (@stylistic + perfectionist sorting) — also passed to neostandard
  browserFiles: ['client/**/*.js'], // Scopes browser globals and disables Node rules for matched files
  cliFiles: ['bin/**/*.js', 'scripts/**/*.js'], // Relaxes rules for CLI scripts (process.exit, console, sync I/O, etc.)
});
```

Passing an unknown option key throws a `TypeError` with a message pointing to the composable pattern — this catches common mistakes like placing custom rules inside the options object.

You can also do custom extensions:

```js
import { voxpelli } from '@voxpelli/eslint-config';

export default [
  ...voxpelli({
    // Config options
  }),
  {
    // Custom ESLint config
  },
];
```

### Re-exported utilities

For framework consumers (Vue, Svelte, Astro) that need the TypeScript parser, `plugins` (from neostandard) and `globals` (from the [globals](https://github.com/sindresorhus/globals) package) are re-exported for convenience:

```js
import { voxpelli, plugins, globals } from '@voxpelli/eslint-config';

export default [
  ...voxpelli({ ts: true }),
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: plugins['typescript-eslint'].parser,
    },
  },
];
```

Note: `voxpelli()` returns a flat config array. With ESLint 9.37+ you can also use `defineConfig()` from `eslint/config` which auto-flattens arrays — no spread needed:

```js
import { defineConfig } from 'eslint/config';
import { voxpelli } from '@voxpelli/eslint-config';

export default defineConfig([
  voxpelli({ /* options */ }),
  { /* custom rules */ },
]);
```

`defineConfig()` also supports an `extends` key inside config objects, which is useful when you need to scope the inherited config to specific files:

```js
import { defineConfig } from 'eslint/config';
import { voxpelli } from '@voxpelli/eslint-config';

export default defineConfig([
  {
    files: ['src/**/*.js'],
    extends: [voxpelli()],
  },
]);
```

### Composable sub-configs

`browserFiles` and `cliFiles` are also exported as standalone config factories for cases where you want to apply their rule sets without using `voxpelli()` as the base:

```js
import { browserFiles, cliFiles } from '@voxpelli/eslint-config';

export default [
  // your own base config …
  ...browserFiles(['client/**/*.js']),
  ...cliFiles(['bin/**/*.js']),
];
```

`browserFiles(globs)` — scopes browser globals and disables Node.js rules for matched files.

`cliFiles(globs)` — relaxes rules appropriate for CLI scripts: allows `process.exit()`, `console`, sync I/O, and top-level non-await patterns.

## How does this differ from pure [neostandard](https://github.com/neostandard/neostandard)?

* :stop_sign: = changed to `error` level
* :warning: = changed to `warn` level
* :mute: = deactivated
* :wrench: = changed config

### :wrench: Changed [neostandard](https://github.com/neostandard/neostandard) rules

* :wrench: [`@stylistic/comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – set to enforce dangling commas in arrays, objects, imports and exports *(disabled by `noStyle`)*
* :wrench: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars) – *changed* – sets `"args": "all", "argsIgnorePattern": "^_",` because I personally don't feel limited by [Express error handlers](https://github.com/standard/standard/issues/419#issuecomment-718186130) + wants to stay in sync with TypeScript `noUnusedParameters`

### :heavy_plus_sign: Added ESLint core rules

* :warning: [`func-style`](https://eslint.org/docs/rules/func-style) – disallows function declarations, good to be consistent with how functions are declared
* :warning: [`no-console`](https://eslint.org/docs/rules/no-console) – warns on existence of `console.log` and similar, as they are mostly used for debugging and should not be committed
* :stop_sign: [`no-constant-binary-expression`](https://eslint.org/docs/rules/no-constant-binary-expression) – errors when binary expressions are detected to constantly evaluate a specific way
* :stop_sign: [`no-nonoctal-decimal-escape`](https://eslint.org/docs/rules/no-nonoctal-decimal-escape) – there's no reason not to ban it
* :stop_sign: [`no-unsafe-optional-chaining`](https://eslint.org/docs/rules/no-unsafe-optional-chaining) – enforces one to be careful with `.?` and not use it in ways that can inadvertently cause errors or `NaN` results
* :warning: [`no-warning-comments`](https://eslint.org/docs/rules/no-warning-comments) – warns of the existence of `FIXME` comments, as they should always be fixed before pushing
* :stop_sign: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand) – requires the use of object shorthands for properties, more tidy

### :package: Added ESLint rule packages

* [`plugin:jsdoc/recommended`](https://github.com/gajus/eslint-plugin-jsdoc#rules)
* [`plugin:mocha/recommended`](https://github.com/lo1tuma/eslint-plugin-mocha#rules)
* [`eslint-plugin-perfectionist`](https://github.com/azat-io/eslint-plugin-perfectionist) (4 sorting rules, replaces `eslint-plugin-sort-destructure-keys`)
* [`plugin:n/recommended`](https://github.com/eslint-community/eslint-plugin-n#-rules)
* [`plugin:promise/recommended`](https://github.com/eslint-community/eslint-plugin-promise#rules)
* [`plugin:security/recommended`](https://github.com/eslint-community/eslint-plugin-security#rules)
* [`plugin:unicorn/recommended`](https://github.com/sindresorhus/eslint-plugin-unicorn#rules)

#### :wrench: Overrides of added ESLint rule packages

* :wrench: [`jsdoc/check-tag-names`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-tag-names.md) – *changed* – allows `@planned` tag for [knip](https://github.com/webpro-nl/knip) unused-export suppression
* :mute: [`jsdoc/check-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/no-undefined-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-undefined-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-param-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-param-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-property-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-property-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-returns-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-returns-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-yields`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-yields.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :wrench: [`jsdoc/tag-lines`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md) – *changed* – to enforce an empty line between description and tags, but disallow them elsewhere.
* :mute: [`jsdoc/valid-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/valid-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/reject-any-type`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/reject-any-type.md) – *deactivated* – too strict for [types in js](https://github.com/voxpelli/types-in-js) workflow
* :mute: [`jsdoc/reject-function-type`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/reject-function-type.md) – *deactivated* – too strict for [types in js](https://github.com/voxpelli/types-in-js) workflow
* :mute: [`jsdoc/require-next-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-next-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-throws-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-throws-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-yields-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-yields-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).

* :mute: [`mocha/no-mocha-arrows`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-mocha-arrows.md) – *deactivated* – while [Mocha discourages arrow functions](https://mochajs.org/#arrow-functions) I find it more readable to use them + I find it safe when combined with type checking as then the type checking will notify one when one tries to do a `this.setTimeout()` or similar in an arrow function where there is no such local context

* :mute: [`n/no-extraneous-import`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-extraneous-import.md) – *deactivated* – superseded by [knip](https://github.com/webpro-nl/knip), which validates imports more accurately without false positives in monorepos
* :mute: [`n/no-process-exit`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-exit.md) – *deactivated* – added by `plugin:n/recommended`, but deactivated in favor of [`unicorn/no-process-exit`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-process-exit.md)

* :mute: [`security/detect-object-injection`](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-object-injection.md) – *deactivated* – causes too many false errors
* :mute: [`security/detect-unsafe-regex`](https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-unsafe-regex.md) – *deactivated* – at least early on wasn't very stable

* :wrench: [`unicorn/catch-error-name`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md) – *changed* – I prefer `err` over `error` as I find `error`to be a far too similar name to the built in `Error` class
* :mute: [`unicorn/explicit-length-check`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/explicit-length-check.md) – *deactivated* – I don't see an issue with `if (string.length)` instead of `if (string.length !== 0)`
* :warning: [`unicorn/unicorn/no-await-expression-member`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/unicorn/no-await-expression-member.md) – *changed* – eg. useful in chai tests
* :warning: [`unicorn/unicorn/no-negated-condition`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/unicorn/no-negated-condition.md) – *deactivated* – turned off, there are valid cases for this, so it simply gets noisy
* :mute: [`unicorn/numeric-separators-style`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/numeric-separators-style.md) – *deactivated* – currently not enough good support for this in engines
* :warning: [`unicorn/prefer-add-event-listener`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-add-event-listener.md) – *changed* – set to `warn` instead of `error`
* :warning: [`unicorn/prefer-event-target`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules//prefer-event-target.md) – *changed* – set to `warn` instead of `error`
* :mute: [`unicorn/prefer-module`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-module.md) – *deactivated*  – only useful when you know you're targetting ESM
* :warning: [`unicorn/prefer-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-spread.md) – *changed* – set to `warn` instead of `error`
* :warning: [`unicorn/prefer-string-replace-all`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-string-replace-all.md) – *changed* – set to `warn` instead of `error`
* :mute: [`unicorn/prevent-abbreviations`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prevent-abbreviations.md) – *deactivated* – same as `unicorn/catch-error-name`, I prefer an abbreviated `err` over a non-abbreviated `error`because the latter is too similar to `Error` for my taste
* :mute: [`unicorn/prefer-string-raw`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-string-raw.md) – *deactivated*
* :wrench: [`unicorn/switch-case-braces`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/switch-case-braces.md) – *changed* – I prefer to avoid braces in `case` statements rather than enforcing them
* :warning: [`unicorn/consistent-assert`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-assert.md) – *changed* – set to `warn`, opinionated assert style preference
* :warning: [`unicorn/consistent-template-literal-escape`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-template-literal-escape.md) – *changed* – set to `warn` instead of `error`
* :warning: [`unicorn/isolated-functions`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/isolated-functions.md) – *changed* – set to `warn`, contentious scoping preference
* :warning: [`unicorn/no-array-reverse`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-reverse.md) – *changed* – set to `warn`, mutating `.reverse()` is common enough
* :warning: [`unicorn/no-array-sort`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-sort.md) – *changed* – set to `warn`, mutating `.sort()` is widely used
* :warning: [`unicorn/no-immediate-mutation`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-immediate-mutation.md) – *changed* – set to `warn`, can be noisy
* :warning: [`unicorn/prefer-class-fields`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-class-fields.md) – *changed* – set to `warn` for gradual adoption
* :warning: [`unicorn/prefer-classlist-toggle`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-classlist-toggle.md) – *changed* – set to `warn`, DOM-specific
* :mute: [`unicorn/prefer-import-meta-properties`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-import-meta-properties.md) – *deactivated* – requires Node.js 20.11+, consistent with `prefer-module` being off by default
* :warning: [`unicorn/prefer-response-static-json`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-response-static-json.md) – *changed* – set to `warn`, API-specific
* :warning: [`unicorn/prefer-simple-condition-first`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/prefer-simple-condition-first.md) – *changed* – set to `warn` instead of `error`
* :warning: [`unicorn/switch-case-break-position`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/switch-case-break-position.md) – *changed* – set to `warn` instead of `error`

### :heavy_plus_sign: Additional standalone ESLint rules

* :stop_sign: [`@stylistic/quote-props`](https://eslint.style/rules/ts/quote-props) – requires properties to be quoted when needed but otherwise disallows it *(disabled by `noStyle`)*

* :warning: [`es-x/no-exponential-operators`](https://eslint-community.github.io/eslint-plugin-es-x/rules/no-exponential-operators.html) – disallows the use of the `**` operator, as that's in most cases a mistake and one really meant to write `*`

* :warning: [`perfectionist/sort-imports`](https://perfectionist.dev/rules/sort-imports.html) – natural-order sort of import statements *(disabled by `noStyle`)*
* :warning: [`perfectionist/sort-named-imports`](https://perfectionist.dev/rules/sort-named-imports.html) – natural-order sort of named import specifiers *(disabled by `noStyle`)*
* :warning: [`perfectionist/sort-named-exports`](https://perfectionist.dev/rules/sort-named-exports.html) – natural-order sort of named export specifiers *(disabled by `noStyle`)*
* :warning: [`perfectionist/sort-objects`](https://perfectionist.dev/rules/sort-objects.html) – natural-order sort of destructured object keys (replaces `eslint-plugin-sort-destructure-keys`) *(disabled by `noStyle`)*

* :warning: [`n/prefer-global/console`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md)
* :warning: [`n/prefer-promises/fs`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md)
* :warning: [`n/no-process-env`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-env.md)
* :stop_sign: [`n/no-sync`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-sync.md)

* :stop_sign: [`promise/prefer-await-to-then`](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-then.md)

* :stop_sign: [`unicorn/consistent-destructuring`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/consistent-destructuring.md) – while unicorn dropped it from their recommended config I still like it, see [#283](https://github.com/voxpelli/eslint-config/issues/283)

## ESM specific rules

Unless one configures `cjs: true` these additional rules will be applied:

#### :wrench: Overrides of rules

* :warning: [`func-style`](https://eslint.org/docs/rules/func-style) – enforces function declarations whenever an arrow function isn't used. Better to do `export function foo () {` than `export const foo = function () {`
* :stop_sign: [`unicorn/prefer-module`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-module.md) – *changed* – restored to its `plugin:unicorn/recommended` value of `error`

## Can I use this in my own project?

You may want to use [neostandard](https://github.com/neostandard/neostandard) instead, it's the general base config that I help maintain for the community. If you follow the [types-in-JS](https://github.com/voxpelli/types-in-js) approach, this config provides battle-tested JSDoc rule tuning validated against 50+ downstream repositories.

I do maintain this project though as if multiple people are using it, so sure, you can use it, but its ultimate purpose is to support my projects.

I do follow  [semantic versioning](https://semver.org/), so the addition or tightening of any checks will trigger major releases whereas minor and patch releases should only ever have relaxation of rules and bug fixes.

## Alternatives

* [`neostandard`](https://github.com/neostandard/neostandard)
* [`xo`](https://github.com/xojs/xo)

## See also

* [`voxpelli/ghatemplates`](https://github.com/voxpelli/ghatemplates) – the templates I use with [`ghat`](https://github.com/fregante/ghat) to update GitHub Actions in my projects
* [`voxpelli/renovate-config-voxpelli`](https://github.com/voxpelli/renovate-config-voxpelli) – the shareable [renovate setup](https://docs.renovatebot.com/config-presets/) I use in my projects
* [`voxpelli/tsconfig`](https://github.com/voxpelli/tsconfig) – the shareable `tsconfig.json` setup I use in my projects

# @voxpelli/eslint-config

[![npm version](https://img.shields.io/npm/v/@voxpelli/eslint-config.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/eslint-config)
[![npm downloads](https://img.shields.io/npm/dm/@voxpelli/eslint-config.svg?style=flat)](https://www.npmjs.com/package/@voxpelli/eslint-config)
[![neostandard javascript style](https://img.shields.io/badge/code_style-neostandard-7fffff?style=flat&labelColor=ff80ff)](https://github.com/neostandard/neostandard)
[![Follow @voxpelli@mastodon.social](https://img.shields.io/mastodon/follow/109247025527949675?domain=https%3A%2F%2Fmastodon.social&style=social)](https://mastodon.social/@voxpelli)

My personal ESLint config which is a supserset of [neostandard](https://github.com/neostandard/neostandard) with a couple of extra checks that I find helpful .

This package follows [semantic versioning](https://semver.org/). Tightening of any checks is a breaking change, therefore that will only happen in major releases. Minor and patch releases will only include relaxation of rules or fixing of minor obvious oversights.

## Can I use this in my own project?

Absolutely, go ahead! I maintain this project as if multiple people are using it. Be sure to give me feedback and if you like it, give me a ping and say so, would make my day 😄

## Usage

### Install

Be sure to install the correct versions of peer dependencies that this module requires, else you will likely get an incorrect rule setup.

To easily install all correct peer dependencies, you can use [`install-peerdeps`](https://www.npmjs.com/package/install-peerdeps):

```bash
install-peerdeps --dev @voxpelli/eslint-config
```

### Configure

Add an `.eslintrc`, or other [ESLint configuration](https://eslint.org/docs/latest/user-guide/configuring/configuration-files), that extends this config:

```
{
  "extends": "@voxpelli",
  "root": true
}
```

### Configure, ESM

Instead of simply extending `@voxpelli` you can extend `@voxpelli/eslint-config/esm` and get a version of the rules that enforces ESM best practices as well.

###

## How does this differ from pure [standard](https://standardjs.com/)?

* :stop_sign: = changed to `error` level
* :warning: = changed to `warn` level
* :mute: = deactivated
* :wrench: = changed config
* :grimacing: = will not pass vanilla [standard](https://standardjs.com/) linting

### :wrench: Changed [standard](https://standardjs.com/) rules

* :wrench::warning::grimacing: [`comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – prefer dangling commas in everything but functions + is it set to `warn` rather than `error` as I gradually move to this setup
* :mute: [`dot-notation`](https://eslint.org/docs/rules/dot-notation) – *deactivated* – clashes with the [`noPropertyAccessFromIndexSignature`](https://www.typescriptlang.org/tsconfig#noPropertyAccessFromIndexSignature) check in TypeScript, [which I use](https://github.com/voxpelli/tsconfig/blob/e0d0360f280d407ad25806381624c672f66e2653/base.json#L23)
* :wrench::grimacing: [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`, can be useful for more readable comments across multiple lines and I see no real downsides to it (Incompatible with standard)
* :wrench: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars) – *changed* – sets `"args": "all", "argsIgnorePattern": "^_",` because I personally don't feel limited by [Express error handlers](https://github.com/standard/standard/issues/419#issuecomment-718186130) + wants to stay in sync with TypeScript `noUnusedParameters`
* :wrench::grimacing: [`semi`](https://eslint.org/docs/rules/semi) and [`no-extra-semi`](https://eslint.org/docs/rules/no-extra-semi) – *changed* – adopts the semicolons setup from [semistandard](https://github.com/standard/semistandard)  (Incompatible with plain standard, compatible with semistandard)
* :wrench::warning: [`n/no-deprecated-api`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error` as often it's not an urgent thing to fix

### :heavy_plus_sign: Added ESLint core rules

* :warning: [`func-style`](https://eslint.org/docs/rules/func-style) – disallows function declarations, good to be consistent with how functions are declared
* :warning: [`no-console`](https://eslint.org/docs/rules/no-console) – warns on existence of `console.log` and similar, as they are mostly used for debugging and should not be committed
* :stop_sign: [`no-constant-binary-expression`](https://eslint.org/docs/rules/no-constant-binary-expression) – errors when binary expressions are detected to constantly evaluate a specific way
* :stop_sign: [`no-nonoctal-decimal-escape`](https://eslint.org/docs/rules/no-nonoctal-decimal-escape) – there's no reason not to ban it
* :stop_sign: [`no-unsafe-optional-chaining`](https://eslint.org/docs/rules/no-unsafe-optional-chaining) – enforces one to be careful with `.?` and not use it in ways that can inadvertently cause errors or `NaN` results
* :warning: [`no-warning-comments`](https://eslint.org/docs/rules/no-warning-comments) – warns of the existence of `FIXME` comments, as they should always be fixed before pushing
* :stop_sign: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand) – requires the use of object shorthands for properties, more tidy
* :stop_sign: [`quote-props`](https://eslint.org/docs/rules/quote-props) – requires properties to be quoted when needed but otherwise disallows it

### :package: Added ESLint rule package

* [`plugin:n/recommended`](https://github.com/eslint-community/eslint-plugin-n#-rules)
* [`plugin:security/recommended`](https://github.com/eslint-community/eslint-plugin-security#rules)
* [`plugin:mocha/recommended`](https://github.com/lo1tuma/eslint-plugin-mocha#rules)
* [`plugin:unicorn/recommended`](https://github.com/sindresorhus/eslint-plugin-unicorn#rules)
* [`plugin:promise/recommended`](https://github.com/eslint-community/eslint-plugin-promise#rules)
* [`plugin:jsdoc/recommended`](https://github.com/eslint-community/eslint-plugin-promise#rules)

#### :wrench: Overrides of added ESLint rule packages

* :mute: [`jsdoc/check-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/check-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/no-undefined-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/no-undefined-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-jsdoc`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-jsdoc.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-param-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-param-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-property-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-property-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-returns-description`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-returns-description.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :mute: [`jsdoc/require-yields`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/require-yields.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).
* :wrench: [`jsdoc/tag-lines`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md) – *changed* – to enforce an empty line between description and tags, but disallow them elsewhere.
* :mute: [`jsdoc/valid-types`](https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/valid-types.md) – *deactivated* – to improve use with [types in js](https://github.com/voxpelli/types-in-js).

* :mute: [`mocha/no-mocha-arrows`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-mocha-arrows.md) – *deactivated* – while [Mocha discourages arrow functions](https://mochajs.org/#arrow-functions) I find it more readable to use them + I find it safe when type checking ones test files as then the type checking will notify one when one tries to do a `this.setTimeout()` or similar in an arrow function where there is no such local context

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
* :wrench: [`unicorn/switch-case-braces`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/switch-case-braces.md) – *changed* – I prefer to avoid braces in `case` statements rather than enforcing them

### :heavy_plus_sign: Additional standalone ESLint rules

* :warning: [`es-x/no-exponential-operators`](https://eslint-community.github.io/eslint-plugin-es-x/rules/no-exponential-operators.html) – disallows the use of the `**` operator, as that's in most cases a mistake and one really meant to write `*`

* :warning: [`import/no-deprecated`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-deprecated.md) – disallows the use of explicitly deprecated code (code marked with `@deprecated`)
* :stop_sign: [`import/no-order`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-order.md) – enforces a specific ordering of imports


* :warning: [`n/prefer-global/console`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-global/console.md)
* :warning: [`n/prefer-promises/fs`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/prefer-promises/fs.md)
* :warning: [`n/no-process-env`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-process-env.md)
* :stop_sign: [`n/no-sync`](https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-sync.md)

* :stop_sign: [`promise/prefer-await-to-then`](https://github.com/eslint-community/eslint-plugin-promise/blob/main/docs/rules/prefer-await-to-then.md)

* :stop_sign: [`sort-destructure-keys/sort-destructure-keys`](https://github.com/mthadley/eslint-plugin-sort-destructure-keys)

## Extended ESM config

By extending `@voxpelli/eslint-config/esm` instead of `@voxpelli` you will get these differences:

#### :wrench: Overrides of rules

* :warning: [`func-style`](https://eslint.org/docs/rules/func-style) – enforces function declarations whenever an arrow function isn't used. Better to do `export function foo () {` than `export const foo = function () {`
* :stop_sign: [`unicorn/prefer-module`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-module.md) – *changed* – restored to its `plugin:unicorn/recommended` value of `error`


## Alternatives

* [`neostandard`](https://github.com/neostandard/neostandard)
* [`xo`](https://github.com/xojs/xo)

## See also

* [`voxpelli/ghatemplates`](https://github.com/voxpelli/ghatemplates) – the templates I use with [`ghat`](https://github.com/fregante/ghat) to update GitHub Actions in my projects
* [`voxpelli/renovate-config-voxpelli`](https://github.com/voxpelli/renovate-config-voxpelli) – the shareable [Renovate setup](https://docs.renovatebot.com/config-presets/) I use in my projects
* [`voxpelli/tsconfig`](https://github.com/voxpelli/tsconfig) – the shareable `tsconfig.json` setup I use in my projects

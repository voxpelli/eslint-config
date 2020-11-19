# @voxpelli/eslint-config

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat)](https://github.com/standard/semistandard)

My personal ESLint config which extends [standard](https://standardjs.com/) / [semistandard](https://github.com/standard/semistandard) with a couple of extra checks that I find helpful in my projects.

Includes the semistandard rules directly rather than relying on [eslint-config-semistandard](https://github.com/standard/eslint-config-semistandard), as that package isn't always trailing the main [eslint-config-standard](https://github.com/standard/eslint-config-standard) package.

This package follows [semantic versioning](https://semver.org/). Tightening of any checks is a breaking change, therefore that will only happen in major releases. Minor and patch releases will only include relaxation of rules or fixing of minor obvious oversights.

Want to use my linting rules? Go ahead! Would love feedback and a comment about you doing so, then I'll be extra careful with eg. following the semantic versioning rules.

## Installation

Be sure to install versions of peer dependencies that are valid according to the peer dependency specification of this module.

As ESLint configs and dependencies can and will change their rules with major releases you will likely get an incorrect ruleset otherwise.

To easily install all correct peer dependencies, you can use [`install-peerdeps`](https://www.npmjs.com/package/install-peerdeps):

```bash
install-peerdeps --dev @voxpelli/eslint-config
```

Then add a `.eslintrc` with the following:

```
{
  "extends": "@voxpelli",
  "root": true
}
```

## How does this differ from pure [standard](https://standardjs.com/)?

### :wrench: Changed [standard](https://standardjs.com/) rules

* :wrench::warning: [`comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – ignore it in everything but functions + is it set to `warn` rather than `error` (Incompatible with standard :warning:)
* :wrench: [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true` (Incompatible with standard :warning:)
* :wrench: [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars) – *changed* – sets `"args": "after-used"`
* :wrench: [`semi`](https://eslint.org/docs/rules/semi) and [`no-extra-semi`](https://eslint.org/docs/rules/no-extra-semi) – *changed* – adopts the semicolons setup from [semistandard](https://github.com/standard/semistandard)  (Incompatible with plain standard :warning:, compatible with semistandard)
* :wrench::warning: [`node/no-deprecated-api`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error`

### :heavy_plus_sign: Added ESLint core rules

* :warning: [`func-style`](https://eslint.org/docs/rules/func-style) – disallows function declarations
* :warning: [`no-console`](https://eslint.org/docs/rules/no-console) – warns on existence of `console.log` and similar, as they are mostly used for debugging and should not be committed
* :warning: [`no-warning-comments`](https://eslint.org/docs/rules/no-warning-comments) – warns of the existence of `FIXME` comments, as they should always be fixed before pushing
* :stop_sign: [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand) – requires the use of object shorthands for properties
* :stop_sign: [`quote-props`](https://eslint.org/docs/rules/quote-props)– requires properties to be quoted when needed, otherwise disallows it

### :package: Added ESLint rule package

* [`plugin:node/recommended`](https://github.com/mysticatea/eslint-plugin-node#-rules)
* [`plugin:security/recommended`](https://github.com/nodesecurity/eslint-plugin-security/blob/master/index.js)
* [`plugin:mocha/recommended`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/index.js)
* [`plugin:unicorn/recommended`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/index.js)
* [`plugin:promise/recommended`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/index.js)
* [`@voxpelli/eslint-config-jsdoc-ts`](https://github.com/voxpelli/eslint-config-jsdoc-ts/blob/main/eslintrc.json) – which is a TypeScript packaging of [`plugin:jsdoc/recommended`](https://github.com/gajus/eslint-plugin-jsdoc#configuration)

#### :wrench: Overrides of added ESLint rule packages

* :mute: [`no-process-exit`](https://eslint.org/docs/rules/no-process-exit) – added by `plugin:node/recommended`, but deactivated in favor of [`unicorn/no-process-exit`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/no-process-exit.md)

* :mute: [`mocha/no-mocha-arrows`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-mocha-arrows.md) – *deactivated* – while [Mocha discourages arrow functions](https://mochajs.org/#arrow-functions) I find it more readable to use them + I find it safe when type checking ones test files as then the type checking will notify one when one tries to do a `this.setTimeout()` or similar in an arrow function where there is no such local context

* :mute: [`security/detect-object-injection`](https://github.com/nodesecurity/eslint-plugin-security#detect-object-injection) – *deactivated* – causes too many false errors
* :mute: [`security/detect-unsafe-regex`](https://github.com/nodesecurity/eslint-plugin-security#detect-unsafe-regex) – *deactivated* – at least early on wasn't very stable

* :wrench: [`unicorn/catch-error-name`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md) – *changed* – I prefer `err` over `error` as I find `error`to be a far too similar name to the built in `Error` class
* :mute: [`unicorn/explicit-length-check`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/explicit-length-check.md) – *deactivated* – I don't see an issue with `if (string.length)` instead of `if (string.length !== 0)`
* :warning: [`unicorn/prefer-add-event-listener`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-add-event-listener.md) – *changed* – set to `warn` instead of `error`
* :warning: [`unicorn/prefer-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-spread.md) – *changed* – set to `warn` instead of `error`
* :mute: [`unicorn/prevent-abbreviations`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prevent-abbreviations.md) – *deactivated* – same as `unicorn/catch-error-name`, I prefer an abbreviated `err` over a non-abbreviated `error`because the latter is too similar to `Error` for my taste

### :heavy_plus_sign: Additional standalone ESLint rules

<!-- TODO: Maybe add promise/prefer-await-to-callbacks -->
<!-- TODO: Maybe add node/no-mixed-requires -->

* :warning: [`es/no-exponential-operators`](https://mysticatea.github.io/eslint-plugin-es/rules/no-exponential-operators.html) – disallows the use of the `**` operator, as that's in most cases a mistake and one really meant to write `*`

* :warning: [`node/prefer-global/console`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/prefer-global/console.md)
* :warning: [`node/prefer-promises/fs`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/prefer-promises/fs.md)
* :warning: [`node/no-process-env`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-process-env.md)
* :stop_sign: [`node/no-sync`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-sync.md)

* :stop_sign: [`promise/prefer-await-to-then`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/prefer-await-to-then.md)

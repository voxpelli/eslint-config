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

## Differs from pure [standard](https://standardjs.com/)

<!-- TODO: Mention something about ecmaVersion and such -->
### Changed [standard](https://standardjs.com/) ESLint rules

* *Incompatible:* [`comma-dangle`](https://eslint.org/docs/rules/comma-dangle) – *changed* – ignore it in everything but functions + is it set to `warn` rather than `error`
* *Incompatible:* [`no-multi-spaces`](https://eslint.org/docs/rules/no-multi-spaces) – *changed* – sets `ignoreEOLComments` to `true`
* *Incompatible:* [`semi`](https://eslint.org/docs/rules/semi) and [`no-extra-semi`](https://eslint.org/docs/rules/no-extra-semi) – *changed* – adopts the semicolons setup from [semistandard](https://github.com/standard/semistandard)
<!-- TODO: Remove allowTemplateLiterals -->
* *Incompatible:* [`quotes`](https://eslint.org/docs/rules/quotes) – *changed* – sets `allowTemplateLiterals`
* [`no-unused-vars`](https://eslint.org/docs/rules/no-unused-vars) – *changed* – sets `"args": "after-used"`
* [`node/no-deprecated-api`](https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-deprecated-api.md) – *changed* – changed to `warn` instead of `error`

### Added ESLint core rules

* [`func-style`](https://eslint.org/docs/rules/func-style) – *warn* – disallows function declarations
* [`no-console`](https://eslint.org/docs/rules/no-console) – *warn* – warns on existence of `console.log` and similar, as they are mostly used for debugging and should not be committed
* [`no-warning-comments`](https://eslint.org/docs/rules/no-warning-comments) – *warn* – warns of the existence of `FIXME` comments, as they should always be fixed before pushing
* [`object-shorthand`](https://eslint.org/docs/rules/object-shorthand) – requires the use of object shorthands for both methods and properties
* [`quote-props`](https://eslint.org/docs/rules/quote-props)– requires properties to be quoted when needed, otherwise disallows it

### Additional ESLint rule packages

* [`plugin:security/recommended`](https://github.com/nodesecurity/eslint-plugin-security/blob/master/index.js)
* [`plugin:mocha/recommended`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/index.js)
* [`plugin:unicorn/recommended`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/index.js)
* [`plugin:promise/recommended`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/index.js)
* [`@voxpelli/eslint-config-jsdoc-ts`](https://github.com/voxpelli/eslint-config-jsdoc-ts/blob/main/eslintrc.json) – which is a TypeScript adaption on top of [`plugin:jsdoc/recommended`](https://github.com/gajus/eslint-plugin-jsdoc#configuration)
<!-- TODO: Add plugin:node/recommended -->

#### Overrides of additional ESLint rule packages

* [`mocha/no-mocha-arrows`](https://github.com/lo1tuma/eslint-plugin-mocha/blob/master/docs/rules/no-mocha-arrows.md) – *deactivated* – while [Mocha discourages arrow functions](https://mochajs.org/#arrow-functions) I find it more readable to use them + I find it safe when type checking ones test files as then the type checking will notify one when one tries to do a `this.setTimeout()` or similar in an arrow function where there is no such local context

<!-- TODO: Remove completely -->
* [`promise/always-return`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/always-return.md) – *deactivated*
<!-- TODO: Remove completely -->
* [`promise/no-callback-in-promise`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/no-callback-in-promise.md) – *deactivated*
<!-- TODO: Remove completely -->
* [`promise/no-nesting`](https://github.com/xjamundx/eslint-plugin-promise/blob/development/docs/rules/no-nesting.md) – *deactivated*

* [`security/detect-object-injection`](https://github.com/nodesecurity/eslint-plugin-security#detect-object-injection) – *deactivated* – causes too many false errors
* [`security/detect-unsafe-regex`](https://github.com/nodesecurity/eslint-plugin-security#detect-unsafe-regex) – *deactivated* – at least early on wasn't very stable

* [`unicorn/catch-error-name`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/catch-error-name.md) – *changed* – I prefer `err` over `error` as I find `error`to be a far too similar name to the built in `Error` class
<!-- TODO: Reactivate? -->
* [`unicorn/consistent-function-scoping`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/consistent-function-scoping.md) – *deactivated*
* [`unicorn/explicit-length-check`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/explicit-length-check.md) – *deactivated* – I don't see an issue with `if (string.length)` instead of `if (string.length !== 0)`
<!-- TODO: Reactivate? -->
* [`unicorn/filename-case`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/filename-case.md) – *deactivated*
* [`unicorn/prefer-add-event-listener`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-add-event-listener.md) – *changed* – set to `warn` instead of `error`
<!-- TODO: Reactivate? -->
* [`unicorn/prefer-spread`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prefer-spread.md) – *changed* – set to `warn` instead of `error`
* [`unicorn/prevent-abbreviations`](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/master/docs/rules/prevent-abbreviations.md) – *deactivated* – same as `unicorn/catch-error-name`, I prefer an abbreviated `err` over a non-abbreviated `error`because the latter is too similar to `Error` for my taste

### Additional standalone ESLint rules

<!-- TODO: Add promise/prefer-await-to-then -->
<!-- TODO: Maybe add promise/prefer-await-to-callbacks -->
<!-- TODO: Maybe add node/no-mixed-requires -->
<!-- TODO: Maybe add node/no-sync -->
<!-- TODO: Maybe add node/no-process-env -->
<!-- TODO: Maybe add node/prefer-global/console -->
<!-- TODO: Maybe add node/prefer-promises/fs -->
* [`es/no-exponential-operators`](https://mysticatea.github.io/eslint-plugin-es/rules/no-exponential-operators.html) – *warn* – disallows the use of the `**` operator, as that's in most cases a mistake and one really meant to write `*`

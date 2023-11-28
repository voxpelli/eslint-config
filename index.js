'use strict';

/** @satisfies {import('eslint').ESLint.ConfigData} */
const config = {
  'extends': [
    './base-configs/standard',
    './base-configs/standard-customizations',
    './base-configs/additional-rules',
    './base-configs/jsdoc',
  ],
  root: true,
};

module.exports = config;

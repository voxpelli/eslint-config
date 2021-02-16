'use strict';

const compliant = [
  'voxpelli/async-htm-to-string',
  'voxpelli/linemod-core',
  'voxpelli/linemod',
  'voxpelli/list-installed',
  'voxpelli/node-bunyan-adaptor',
  'voxpelli/node-connect-pg-simple',
  'voxpelli/node-installed-check-core',
  'voxpelli/node-installed-check',
  'voxpelli/node-pg-pubsub',
  'voxpelli/node-promised-retry',

];

const almostCompliant = [
];

const nonCompliant = [
  'dependency-check-team/dependency-check',
  'voxpelli/node-fetch-politely',
  'voxpelli/node-fulfills',
  'voxpelli/node-github-publish',
  'voxpelli/node-jekyll-utils',
  'voxpelli/node-micropub-express',
  ...almostCompliant
];

module.exports = {
  repositories: [
    // eslint-disable-next-line node/no-process-env
    ...(process.env.VP_ESLINT_TESTER_ALL ? nonCompliant : []),
    // eslint-disable-next-line node/no-process-env
    ...(process.env.VP_ESLINT_TESTER_ALMOST ? almostCompliant : []),
    ...compliant,
  ],
  extensions: ['js'],
  eslintrc: require('./eslintrc.json'),
  rulesUnderTesting: function ruleFilter (ruleId, { repository }) {
    if (ruleId === 'node/no-extraneous-require') return false;
    if (ruleId === 'node/no-missing-require') return false;
    if (repository === 'voxpelli/linemod' && ['node/shebang'].includes(ruleId)) return false;
    if (repository === 'voxpelli/node-bunyan-adaptor' && ['no-console'].includes(ruleId)) return false;
    if (repository === 'voxpelli/node-connect-pg-simple' && ['node/no-process-env'].includes(ruleId)) return false;
    if (repository === 'voxpelli/node-installed-check' && ['node/shebang'].includes(ruleId)) return false;
    if (repository === 'voxpelli/node-pg-pubsub' && ['no-console', 'node/no-process-env'].includes(ruleId)) return false;

    return true;
  },
  pathIgnorePattern: `(${[
    'test/',
    'node_modules/',
    '\\/\\.', // Any file or directory starting with dot, e.g. ".git"
  ].join('|')})`,
};

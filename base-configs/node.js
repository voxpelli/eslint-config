import nPlugin from 'eslint-plugin-n';

/**
 * @param {boolean} cjs
 * @returns {import('eslint').Linter.FlatConfig[]}
 */
export function nodeRules (cjs) {
  return [
    {
      ...renamePlugin('n', 'voxpelli-n', nPlugin.configs['flat/recommended-module']),
      // If CommonJS, only target *.mjs, target everything but *.cjs
      ...cjs ? { files: ['**/*.mjs'] } : { ignores: ['**/*.cjs'] },
    },
    {
      ...renamePlugin('n', 'voxpelli-n', nPlugin.configs['flat/recommended-script']),
      // If CommonJS, target everything but *.mjs, else only target *.cjs
      ...cjs ? { ignores: ['**/*.mjs'] } : { files: ['**/*.cjs'] },
    },
    {
      name: '@voxpelli/additional/node',
      rules: {
        // Overriding
        'voxpelli-n/no-process-exit': 'off',

        // Adding
        'voxpelli-n/prefer-global/console': 'warn',
        'voxpelli-n/prefer-promises/fs': 'warn',
        'voxpelli-n/no-process-env': 'warn',
        'voxpelli-n/no-sync': 'error',
      },
    },
    {
      name: '@voxpelli/additional/node/ts',
      files: ['**/*.ts'],
      rules: {
        // TODO: Remove when *.js files can be properly resolved from *.d.ts
        'voxpelli-n/no-missing-import': 'off',
      },
    },
  ];
}

/**
 * @param {string} existingPluginName
 * @param {string} newPluginName
 * @param {import('eslint').Linter.FlatConfig} rawConfig
 * @returns {import('eslint').Linter.FlatConfig}
 */
function renamePlugin (existingPluginName, newPluginName, rawConfig) {
  const config = {
    ...rawConfig,
    plugins: { ...rawConfig.plugins },
    rules: { ...rawConfig.rules },
  };

  if ('plugins' in config && 'rules' in config) {
    const plugin = config.plugins[existingPluginName];

    if (plugin) {
      config.plugins[newPluginName] = plugin;
      delete config.plugins[existingPluginName];

      for (const key in config.rules) {
        config.rules[key.replaceAll(existingPluginName + '/', newPluginName + '/')] = config.rules[key];
        delete config.rules[key];
      }

      return config;
    }
  }

  throw new Error(`Could not rename "${existingPluginName}" plugin`);
}

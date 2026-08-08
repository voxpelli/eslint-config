/** @satisfies {import('eslint').Linter.Config[]} */
export const modifiedNeostandardStyleRules = [
  {
    name: '@voxpelli/modified/neostandard/style',
    rules: {
      '@stylistic/comma-dangle': ['warn', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      }],
      '@stylistic/object-curly-newline': ['warn', {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
        ExportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      }],
    },
  },
];

/**
 * @param {ReturnType<typeof import('neostandard')['resolveFilePatterns']>} filePatterns
 * @returns {import('eslint').Linter.Config[]}
 */
export function modifiedNeostandardRules (filePatterns) {
  const {
    ignores,
    jsTsFiles,
    tsFiles,
  } = filePatterns;

  return [
    {
      name: '@voxpelli/modified/neostandard',
      files: jsTsFiles,
      ignores,
      rules: {
        'no-unused-vars': ['error', {
          'vars': 'all',
          'args': 'all',
          'argsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
        }],
      },
    },
    {
      name: '@voxpelli/modified/neostandard/ts',
      files: tsFiles,
      ignores,
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', {
          'vars': 'all',
          'args': 'all',
          'argsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
        }],
      },
    },
  ];
}

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    jest: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaFeatures: {
      globalReturn: false,
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:jest-dom/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: [
    '@typescript-eslint',
    'react-refresh',
    'testing-library',
    'jest-dom',
    'import',
    'react',
  ],
  rules: {
    'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-unsafe-argument' : 'off',
    '@typescript-eslint/no-unsafe-assignment' : 'off',
    '@typescript-eslint/no-unsafe-return' : 'off',
    'react-hooks/rules-of-hooks' : 'off',
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'error',
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        allowSeparatedGroups: true,

      },
    ],
    'import/named': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'index', 'sibling'],
          'type',
          'object',
          'unknown',
        ],
        pathGroups: [
          {
            pattern: 'react*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react*/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'twin.macro',
            group: 'external',
            position: 'after',
          },
          {
            pattern: 'highcharts/highstock',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '#assets/**',
            group: 'unknown',
            position: 'before',
          },
          {
            pattern: '#/*/**',
            group: 'type',
            position: 'after',
          },
          {
            pattern: '#*/**',
            group: 'type',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: [],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    'import/external-module-folders': ['.yarn'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  ignorePatterns: [
    '*.config.js',
    '*.config.mjs',
    '*.setup.js',
    'config/**/*',
    '*/external/**/*',
    'dist',
    './.eslintrc.cjs',

  ],
};

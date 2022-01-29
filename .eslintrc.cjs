const { readFileSync } = require('fs');
const schemaString = readFileSync(`${__dirname}/data/schema.graphql`, 'utf8');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:react/jsx-runtime',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'graphql', 'simple-import-sort', 'import'],
  overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-unused-vars': 'off',
        'no-undef': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/no-v-html': 'off',
      },
    },
    {
      files: ['@app/client/src/**', '*.vue'],
      rules: {
        'react-hooks/rules-of-hooks': 0,
        'react-hooks/exhaustive-deps': 0,
        'graphql/template-strings': [
          'error',
          {
            env: 'literal',
            schemaString,
            validators: [
              'ExecutableDefinitionsRule',
              'FieldsOnCorrectTypeRule',
              'FragmentsOnCompositeTypesRule',
              'KnownArgumentNamesRule',
              'KnownDirectivesRule', // disabled by default in relay
              // "KnownFragmentNamesRule", // disabled by default in all envs
              'KnownTypeNamesRule',
              'LoneAnonymousOperationRule',
              'NoFragmentCyclesRule',
              'NoUndefinedVariablesRule', //disabled by default in relay
              // "NoUnusedFragmentsRule" // disabled by default in all envs
              // "NoUnusedVariablesRule" throws even when fragments use the variable
              'OverlappingFieldsCanBeMergedRule',
              'PossibleFragmentSpreadsRule',
              'ProvidedRequiredArgumentsRule', // disabled by default in relay
              'ScalarLeafsRule', // disabled by default in relay
              'SingleFieldSubscriptionsRule',
              'UniqueArgumentNamesRule',
              'UniqueDirectivesPerLocationRule',
              'UniqueFragmentNamesRule',
              'UniqueInputFieldNamesRule',
              'UniqueOperationNamesRule',
              'UniqueVariableNamesRule',
              'ValuesOfCorrectTypeRule',
              'VariablesAreInputTypesRule',
              // "VariablesDefaultValueAllowedRule",
              'VariablesInAllowedPositionRule',
            ],
          },
        ],
        'graphql/named-operations': [
          'error',
          {
            schemaString,
          },
        ],
        'graphql/required-fields': [
          'error',
          {
            env: 'literal',
            schemaString,
            requiredFields: ['nodeId'],
          },
        ],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    'import/core-modules': [
      'virtual:windi-base.css',
      'virtual:windi-components.css',
      'virtual:windi-utilities.css',
      'vite-ssr',
      'unplugin-auto-import/vite',
      'unplugin-icons/resolver',
      'unplugin-icons/vite',
      'unplugin-vue-components/vite',
      'virtual:windi-devtools',
      'unplugin-vue-components/resolvers',
      'unplugin-icons/loaders',
    ],
  },
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        args: 'after-used',
        ignoreRestSiblings: true,
      },
    ],
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
    'no-console': 0,
    'no-confusing-arrow': 0,
    'no-else-return': 0,
    'no-return-assign': [2, 'except-parens'],
    'no-underscore-dangle': 0,
    camelcase: 0,
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
      },
    ],
    'class-methods-use-this': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],

    'import/no-extraneous-dependencies': 0,

    'arrow-body-style': 0,
    'no-nested-ternary': 0,

    /*
     * simple-import-sort seems to be the most stable import sorting currently,
     * disable others
     */
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'sort-imports': 'off',
    'import/order': 'off',

    'import/no-deprecated': 'warn',
    'import/no-duplicates': 'error',
  },
};

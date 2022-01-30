/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

/* eslint-env node */

const path = require('path');
const { styles } = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  devtool: false,
  context: __dirname,
  performance: { hints: false },

  entry: path.resolve(__dirname, 'src', 'ckeditor.ts'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ckeditor.js',
    libraryTarget: 'module',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        legalComments: 'none',
      }),
    ],
  },

  experiments: {
    outputModule: true,
  },

  plugins: [
    new CKEditorWebpackPlugin({
      // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
      // When changing the built-in language, remember to also change it in the editor's configuration (src/ckeditor.js).
      language: 'en',
      additionalLanguages: 'all',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: { build: true, mode: 'write-dts' },
    }),
  ],

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['raw-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag',
              attributes: {
                'data-cke': true,
              },
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: styles.getPostCssConfig({
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark'),
                },
                minify: true,
              }),
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        exclude: /node_modules/,
        options: {
          loader: 'ts',
          target: 'es2015',
        },
      },
    ],
  },
};

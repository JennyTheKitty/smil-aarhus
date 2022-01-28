import vueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import {
  HeadlessUiResolver,
  NaiveUiResolver,
} from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
// @ts-ignore
import { imagetools } from 'vite-imagetools';
import WindiCSS from 'vite-plugin-windicss';
import viteSSR from 'vite-ssr/plugin.js';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
      '@vue/compiler-dom': path.resolve(__dirname, 'src', 'shims', 'blank.js'),
      '@vue/compiler-core': path.resolve(__dirname, 'src', 'shims', 'blank.js'),
      'graphql/language/parser.mjs': path.resolve(
        __dirname,
        'src',
        'shims',
        'parse.js'
      ),
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    minify: 'terser',
    sourcemap: true,
    terserOptions: {
      output: {
        comments: false,
      },
      mangle: true,
    },
    polyfillModulePreload: false,
    reportCompressedSize: false,
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/head',
      '@vueuse/core',
      '@vueuse/shared',
      '@vueuse/integrations',
      '@urql/core',
      '@urql/devtools',
      '@urql/exchange-auth',
      '@urql/exchange-graphcache',
      '@urql/vue',
      '@headlessui/vue',
      '@ckeditor/ckeditor5-basic-styles/src/bold.js',
      '@ckeditor/ckeditor5-basic-styles/src/italic.js',
      '@ckeditor/ckeditor5-editor-classic/src/classiceditor',
      '@ckeditor/ckeditor5-editor-inline/src/inlineeditor',
      '@ckeditor/ckeditor5-essentials/src/essentials.js',
      '@ckeditor/ckeditor5-heading/src/heading.js',
      '@ckeditor/ckeditor5-link/src/link.js',
      '@ckeditor/ckeditor5-list/src/list.js',
      '@ckeditor/ckeditor5-paragraph/src/paragraph.js',
      '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js',
      '@ckeditor/ckeditor5-typing/src/texttransformation.js',
      '@ckeditor/ckeditor5-theme-lark',
      '@ckeditor/ckeditor5-typing',
      '@ckeditor/ckeditor5-vue',
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/list',
      '@fullcalendar/timegrid',
      '@fullcalendar/vue3',
      '@fullcalendar/interaction',
      '@fullcalendar/core/vdom.cjs',
      '@fullcalendar/core/locales/da',
      'abab',
      'naive-ui',
      'petite-vue-i18n',
      'graphql-tag',
      'jsdom',
      'muuri',
      'preact',
    ],
    exclude: ['vue-demi'],
  },
  plugins: [
    viteSSR({
      excludeSsrComponents: [
        /CalendarWidget.vue/,
        /ContentEditor.vue/,
        /Pictures.vue/,
        /\@fullcalendar\/core\/vdom\.cjs/,
      ],
      build: {
        clientOptions: {
          build: {
            rollupOptions: {
              output: {
                manualChunks: (id) => {
                  if (id.includes('~icons')) {
                    return 'vendor';
                  }
                  if (id.includes('node_modules')) {
                    if (id.includes('@iconify')) {
                      return 'vendor_iconify';
                    }
                    if (id.includes('@fullcalendar')) {
                      return 'vendor_cal';
                    }
                    if (id.includes('preact')) {
                      return 'vendor_preact';
                    }
                    if (id.includes('muuri') || id.includes('photoswipe')) {
                      return 'vendor_pic';
                    }
                    if (id.includes('axios')) {
                      return 'vendor_axios';
                    }
                    if (
                      id.includes('naive-ui') ||
                      id.includes('date-fns') ||
                      id.includes('vueuc') ||
                      id.includes('seemly') ||
                      id.includes('vooks') ||
                      id.includes('vfonts') ||
                      id.includes('vdirs') ||
                      id.includes('treemate') ||
                      id.includes('async-validator') ||
                      id.includes('evtd') ||
                      id.includes('highlight.js') ||
                      id.includes('@ckeditor') ||
                      id.includes('resize-observer-polyfill') ||
                      id.includes('css-render') ||
                      id.includes('lodash') ||
                      id.includes('@emotion') ||
                      id.includes('csstype')
                    ) {
                      return 'vendor_authed';
                    }

                    return 'vendor'; // all other package goes here
                  }
                },
              },
            },
          },
        },
      },
    }),
    Vue({
      include: [/\.vue$/],
      template: {
        ssr: true,
      },
    }),
    vueI18n({
      include: path.resolve(__dirname, './src/lang/**'),
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/head',
        '@vueuse/core',
        {
          '@app/client/src/utils': [
            'key',
            'useWaitImportComponent',
            'useTranslation',
            'useShort',
          ],
          '@app/client/src/store': ['useStore'],
          'petite-vue-i18n': ['useI18n'],
          '@urql/vue': ['useQuery', 'useMutation', 'useClientHandle'],
          '@vueuse/shared': ['promiseTimeout'],
        },
      ],
      dts: path.resolve(__dirname, 'src', 'auto-imports.d.ts'),
      resolvers: [
        IconsResolver({
          prefix: 'Icon',
          customCollections: ['smil'],
        }),
      ],
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: 'icon',
          customCollections: ['smil'],
          // enabledCollections: ['carbon']
        }),
        HeadlessUiResolver({}),
        NaiveUiResolver(),
      ],
      dts: path.resolve(__dirname, 'src', 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        smil: FileSystemIconLoader(
          path.resolve(__dirname, 'src', 'assets', 'icons')
        ),
      },
    }),
    WindiCSS({}),
    imagetools(),
  ],
});

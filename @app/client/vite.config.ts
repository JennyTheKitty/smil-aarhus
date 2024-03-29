import vueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
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
  build: {
    minify: 'esbuild',
    sourcemap: true,
    // terserOptions: {
    //   mangle: false,
    // },
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
      '@urql/core',
      '@urql/devtools',
      '@urql/exchange-auth',
      '@urql/exchange-graphcache',
      '@urql/vue',
      '@headlessui/vue',
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
        /FormDialog.vue/,
      ],
      build: {
        clientOptions: {
          resolve: {
            alias: {
              'naive-ui': 'naive-ui/es',
            },
          },
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

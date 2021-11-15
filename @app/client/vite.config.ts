import vueI18n from '@intlify/vite-plugin-vue-i18n';
import Vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers';
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
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    // minify: 'terser',
    // sourcemap: true,
    // terserOptions: {
    //   compress: false,
    //   mangle: false,
    //   output: {
    //     comments: false,
    //   },
    // },
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/head',
      '@vueuse/core',
      '@vueuse/integrations',
      '@urql/core',
      '@urql/devtools',
      '@urql/exchange-auth',
      '@urql/exchange-graphcache',
      '@urql/vue',
      '@headlessui/vue',
      '@ckeditor/ckeditor5-build-classic',
      '@ckeditor/ckeditor5-build-inline',
      '@ckeditor/ckeditor5-vue',
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/list',
      '@fullcalendar/timegrid',
      '@fullcalendar/vue3',
      '@fullcalendar/core/vdom.cjs',
      '@fullcalendar/core/locales/da',
      'abab',
      'naive-ui',
      'petite-vue-i18n',
    ],
    exclude: ['vue-demi'],
  },
  define: {
    __ROOT_URL__: JSON.stringify(process.env.ROOT_URL),
  },
  plugins: [
    viteSSR({
      excludeSsrComponents: [/MonthCalendar.vue/, /ContentEditor.vue/],
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
          '@app/client/src/symbols': ['key'],
          'petite-vue-i18n': ['useI18n'],
          '@urql/vue': ['useQuery', 'useMutation'],
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
        HeadlessUiResolver(),
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

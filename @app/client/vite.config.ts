import vueI18n from "@intlify/vite-plugin-vue-i18n";
import Vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
// @ts-ignore
import { imagetools } from "vite-imagetools";
import WindiCSS from "vite-plugin-windicss";
import viteSSR from "vite-ssr/plugin.js";

export const ssrTransformCustomDir = () => ({
  props: [],
  needRuntime: true,
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  server: {
    fs: {
      strict: true,
    },
  },
  // optimizeDeps: {
  //   include: [
  //     "vue",
  //     "vue-router",
  //     "@vueuse/head",
  //     "@vueuse/core",
  //     "@vue/apollo-composable"
  //   ],
  //   exclude: ["vue-demi"],
  // },
  build: {
    minify: true,
  },
  define: {
    __ROOT_URL__: JSON.stringify(process.env.ROOT_URL),
  },
  plugins: [
    viteSSR({
      // @ts-ignore
      // getRenderContext({ request, response }) {
      //   return {
      //     graphileApolloLink: new GraphileApolloLink(request, response),
      //   };
      // },
      excludeSsrComponents: [/EventCalendar.vue/],
    }),
    Vue({
      include: [/\.vue$/],
      template: {
        ssr: true,
        compilerOptions: {
          directiveTransforms: {
            // "b-modal": ssrTransformCustomDir,
            // "b-popover": ssrTransformCustomDir,
            // "b-toggle": ssrTransformCustomDir,
            // "b-tooltip": ssrTransformCustomDir,
            // "b-visible": ssrTransformCustomDir,
          },
        },
      },
    }),
    vueI18n({
      include: path.resolve(__dirname, "./src/lang/**"),
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-i18n",
        "vue-router",
        "@vueuse/head",
        "@vueuse/core",
        {
          "@vue/apollo-composable": ["useQuery", "useMutation", "useResult"],
          "@app/client/src/symbols": ["key"],
        },
      ],
      dts: path.resolve(__dirname, "src", "auto-imports.d.ts"),
      resolvers: [
        IconsResolver({
          prefix: "Icon",
          customCollections: ["smil"],
        }),
      ],
    }),
    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ["vue"],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          componentPrefix: "icon",
          customCollections: ["smil"],
          // enabledCollections: ['carbon']
        }),
        HeadlessUiResolver(),
      ],
      dts: path.resolve(__dirname, "src", "components.d.ts"),
    }),
    Icons({
      autoInstall: true,
      customCollections: {
        smil: FileSystemIconLoader(
          path.resolve(__dirname, "src", "assets", "icons")
        ),
      },
    }),
    WindiCSS({}),
    imagetools(),
  ],
});

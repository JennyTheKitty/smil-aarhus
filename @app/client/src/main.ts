// windicss layers
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
// your custom styles here
import './styles/main.css';
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css';
import '@vue/runtime-dom';
import 'nprogress/nprogress.css';

import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from '@urql/core';
import urql from '@urql/vue';
import { createHead } from '@vueuse/head';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import viteSSR, { ClientOnly } from 'vite-ssr';
import { Router } from 'vue-router';

import App from './App.vue';
import { i18n, Trans } from './i18n';
import routes from './routes';

// @ts-ignore
// eslint-disable-next-line no-undef
if (__ROOT_URL__ === '') {
  console.log(import.meta.env);
  throw new Error('No ROOT_URL');
}

if (!import.meta.env.SSR && import.meta.env.DEV) {
  // @ts-ignore
  (async () => import('virtual:windi-devtools'))();
}

export default viteSSR(
  App,
  {
    routes,
    transformState(state, defaultTransformer) {
      if (import.meta.env.SSR) {
        state.urqlCache = Object.fromEntries(
          Object.entries(
            (state.ssr as ReturnType<typeof ssrExchange>).extractData()
          ).map(([key, val]) => {
            return [
              key,
              { ...val, data: val.data?.replace(/(?<!\\)\\(.)/g, '\\\\$1') },
            ];
          })
        );
      }
      delete state.ssr;
      return defaultTransformer(state);
    },
    pageProps: {
      passToPage: false,
    },
  },
  async (ctx) => {
    const { app, initialState, request, router } = ctx;
    const head = createHead();
    app.use(head);

    app.use(i18n);
    app.provide(key.i18nRoute, Trans.i18nRoute.bind(Trans));

    app.component(ClientOnly.name, ClientOnly);

    const isServerSide = import.meta.env.SSR;

    if (!isServerSide) {
      const { isLoading } = useNProgress();

      (router as Router).beforeEach((to, from, next) => {
        isLoading.value = true;
        next();
      });
      (router as Router).afterEach(() => {
        isLoading.value = false;
      });
    }

    const lastExchange = isServerSide
      ? (request as { _koaCtx: any } | undefined)?._koaCtx.state
          .graphileExchange
      : fetchExchange;

    const ssr = ssrExchange({
      isClient: !isServerSide,
      initialState: !isServerSide ? initialState.urqlCache : {},
    });
    initialState.ssr = ssr;

    const client = createClient({
      // @ts-ignore
      // eslint-disable-next-line no-undef
      url: `${__ROOT_URL__}/graphql`,
      exchanges: [dedupExchange, cacheExchange, ssr, lastExchange],
    });

    app.use(urql, client);

    return { head };
  }
);

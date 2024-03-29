// windicss layers
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
// your custom styles here
import './styles/main.css';
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css';
import '@vue/runtime-dom';
import 'nprogress/nprogress.css';

import { fetchExchange, ssrExchange } from '@urql/core';
import urql from '@urql/vue';
import { createHead } from '@vueuse/head';
import { parse as acceptLanguageParser } from 'accept-language-parser';
import { createPinia } from 'pinia';
import viteSSR, { ClientOnly } from 'vite-ssr';
import { Router } from 'vue-router';

import App from './App.vue';
import { i18n, userLangs } from './i18n';
import { routes } from './routes';
import { createClient } from './urql';

if (!import.meta.env.SSR && import.meta.env.DEV) {
  // @ts-ignore
  (async () => import('virtual:windi-devtools'))();
}

export default viteSSR(
  App,
  {
    routes,
    routerOptions: {
      scrollBehavior(to: any, from: any, savedPosition: any) {
        if (savedPosition) {
          return savedPosition;
        } else {
          if (to.name !== from.name) {
            return { top: 0 };
          }
        }
      },
    },
    transformState(state, defaultTransformer) {
      if (import.meta.env.SSR) {
        state.urqlCache = Object.fromEntries(
          Object.entries(
            (state.ssr as ReturnType<typeof ssrExchange>).extractData()
          ).map(([key, val]) => {
            return [key, { ...val, data: val.data }];
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
    app.use(createPinia());
    app.use(i18n);

    userLangs.value = [
      ...(import.meta.env.SSR
        ? request?.headers['accept-language']
          ? acceptLanguageParser(request.headers['accept-language']).map(
              (l) => l.code + (l.region ? `-${l.region}` : '')
            )
          : []
        : [window.navigator.language]),
    ].map((l) => ({ lang: l, langNoISO: l.split('-')[0] }));

    app.component(ClientOnly.name, ClientOnly);

    const isServerSide = import.meta.env.SSR;

    if (!isServerSide) {
      // const { isLoading } = useNProgress();

      // (router as Router).beforeEach((to, from, next) => {
      //   isLoading.value = true;
      //   next();
      // });
      // (router as Router).afterEach(() => {
      //   isLoading.value = false;
      // });

      void (async () => {
        const Iconify = await import('@iconify/iconify');
        Iconify.resumeObserver();
      })();
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

    app.use(urql, createClient(lastExchange, ssr));

    return { head };
  }
);

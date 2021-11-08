// windicss layers
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
// your custom styles here
import './styles/main.css';
// windicss utilities should be the last style import
import 'virtual:windi-utilities.css';
import '@vue/runtime-dom';

// NOTE: Very important this isn't imported from @apollo/client
// or it will drag @types/react along with it
import { InMemoryCache } from '@apollo/client/core';
import { provideApolloClient } from '@vue/apollo-composable';
import { createApolloProvider } from '@vue/apollo-option';
import { createHead } from '@vueuse/head';
import viteSSR, { ClientOnly } from 'vite-ssr';

import { createApolloClient } from './apollo';
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
      if (import.meta.env.SSR) state.apolloCache = state.apolloCache.extract();

      return defaultTransformer(state);
    },
    pageProps: {
      passToPage: false,
    },
  },
  async (ctx) => {
    const { app, initialState, graphileApolloLink } = ctx;
    const head = createHead();
    app.use(head);

    app.use(i18n);
    app.provide(key.i18nRoute, Trans.i18nRoute.bind(Trans));

    app.component(ClientOnly.name, ClientOnly);

    const cache = new InMemoryCache({
      dataIdFromObject: (object) => object.nodeId as string,
    });
    if (!import.meta.env.SSR) {
      cache.restore(initialState.apolloCache);
    }
    initialState.apolloCache = cache;

    const ApolloLink =
      import.meta.env.SSR && graphileApolloLink ? graphileApolloLink : null;

    const defaultClient = createApolloClient(
      import.meta.env.SSR,
      initialState.apolloCache,
      ApolloLink,
      initialState.csrfToken
    );

    provideApolloClient(defaultClient);

    const apolloProvider = createApolloProvider({
      defaultClient,
    });
    app.use(apolloProvider);

    return { head };
  }
);

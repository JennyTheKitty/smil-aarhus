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
  EventTagTr,
  EventTr,
  EventViaEventTag,
  EventViaGroup,
  GroupTr,
  Page,
  PageTr,
} from '@app/graphql/dist/client';
import schema from '@app/graphql/dist/introspection';
import {
  createClient,
  dedupExchange,
  fetchExchange,
  makeOperation,
  ssrExchange,
} from '@urql/core';
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import urql from '@urql/vue';
import { createHead } from '@vueuse/head';
import { useNProgress } from '@vueuse/integrations/useNProgress';
import { parse as acceptLanguageParser } from 'accept-language-parser';
import jwtDecode from 'jwt-decode';
import viteSSR, { ClientOnly } from 'vite-ssr';
import { Router } from 'vue-router';

import { accessToken } from './accessToken';
import App from './App.vue';
import { i18n, Trans, userLangs } from './i18n';
import { routes } from './routes';

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

      exchanges: [
        ...(import.meta.env.DEV ? [devtoolsExchange] : []),
        dedupExchange,
        ssr,
        cacheExchange({
          // @ts-ignore
          schema,
          updates: {
            Mutation: {
              authenticate(_result, _args, cache, _info) {
                cache.invalidate({ __typename: 'Query' }, 'currentMember');
              },
              logout(_result, _args, cache, _info) {
                cache.invalidate({ __typename: 'Query' }, 'currentMember');
              },
            },
          },
          keys: {
            EventTr: (data) =>
              `${(data as EventTr).languageCode}|${(data as EventTr).eventId}`,
            PageTr: (data) =>
              `${(data as PageTr).languageCode}|${(data as PageTr).pageName}`,
            GroupTr: (data) =>
              `${(data as GroupTr).languageCode}|${(data as GroupTr).groupId}`,
            EventTagTr: (data) =>
              `${(data as EventTagTr).languageCode}|${
                (data as EventTagTr).tagId
              }`,
            EventViaGroup: (data) =>
              `${(data as EventViaGroup).eventId}|${
                (data as EventViaGroup).groupId
              }`,
            EventViaEventTag: (data) =>
              `${(data as EventViaEventTag).eventId}|${
                (data as EventViaEventTag).tagId
              }`,
            Page: (data) => (data as Page).name,
            ResponsiveImage: () => null,
          },
        }),
        authExchange({
          async getAuth({}) {
            if (import.meta.env.SSR) return null;
            try {
              const res = await fetch('/access_token', {
                method: 'POST',
                credentials: 'include',
              });
              const data = JSON.parse(await res.text()) as {
                ok: boolean;
                access_token: string;
              };

              if (!data.ok || !data.access_token) {
                return null;
              }

              accessToken.value = data.access_token;

              return {};
            } catch (err) {
              return null;
            }
          },

          addAuthToOperation({ operation }) {
            const fetchOptions =
              typeof operation.context.fetchOptions === 'function'
                ? operation.context.fetchOptions()
                : operation.context.fetchOptions || {};

            const headers = fetchOptions.headers || {};
            if (accessToken.value) {
              headers['Authorization'] = `Bearer ${accessToken.value}`;
            } else {
              delete headers['Authorization'];
            }

            return makeOperation(operation.kind, operation, {
              ...operation.context,
              fetchOptions: {
                ...fetchOptions,
                headers,
              },
            });
          },
          didAuthError({ error }) {
            return error.graphQLErrors.some((e) => {
              console.log(e);
              // return (
              //   (e as any).response.status === 401 ||
              //   (e as any).response.status === 403
              // );
              return false;
            });
          },
          willAuthError({ operation }) {
            if (operation.kind === 'mutation') {
              if (!accessToken.value) {
                return !operation.query.definitions.some((definition) => {
                  return (
                    definition.kind === 'OperationDefinition' &&
                    definition.selectionSet.selections.some((node) => {
                      return (
                        node.kind === 'Field' &&
                        (node.name.value === 'authenticate' ||
                          node.name.value === 'logout')
                      );
                    })
                  );
                });
              } else {
                const { exp } = jwtDecode(accessToken.value) as {
                  exp: number;
                };
                return Date.now() >= exp * 1000;
              }
            } else if (operation.kind === 'query') {
              if (
                !accessToken.value &&
                operation.query.definitions.some((definition) => {
                  return (
                    definition.kind === 'OperationDefinition' &&
                    definition.selectionSet.selections.some((node) => {
                      return (
                        node.kind === 'Field' &&
                        node.name.value === 'currentMember'
                      );
                    })
                  );
                })
              )
                return true;
            }

            return false;
          },
        }),
        lastExchange,
      ],
    });

    app.use(urql, client);

    return { head };
  }
);

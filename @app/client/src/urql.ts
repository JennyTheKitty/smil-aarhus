import {
  InfoPagesQueryDocument,
  PicturesQueryDocument,
  GraphCacheConfig,
} from '@app/graphql/dist/client';
import schema from '@app/graphql/dist/introspection';
import {
  Client,
  createClient as urqlCreateClient,
  dedupExchange,
  Exchange,
  makeOperation,
} from '@urql/core';
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import jwtDecode from 'jwt-decode';

import { accessToken } from './accessToken';

export function createClient(lastExchange: Exchange, ssr: Exchange): Client {
  return urqlCreateClient({
    url: `/graphql`,

    exchanges: [
      ...(import.meta.env.DEV ? [devtoolsExchange] : []),
      dedupExchange,
      cacheExchange<GraphCacheConfig>({
        schema,
        updates: {
          Mutation: {
            authenticate(_result, _args, cache, _info) {
              cache.invalidate({ __typename: 'Query' }, 'currentMember');
            },
            logout(_result, _args, cache, _info) {
              cache.invalidate({ __typename: 'Query' }, 'currentMember');
            },
            reorderPictures(_result, args, cache, _info) {
              cache.updateQuery({ query: PicturesQueryDocument }, (data) => {
                const pictures = data!.pictures!;
                for (const reorder of (
                  args!.input! as {
                    reorders: { fromRank: number; toRank: number }[];
                  }
                ).reorders) {
                  const picture = pictures.find(
                    (picture) => picture.rank === reorder.fromRank
                  );
                  if (picture) {
                    picture.rank = reorder.toRank;
                  }
                }
                data!.pictures!.sort((a, b) => a.rank - b.rank);
                return data;
              });
            },
            deletePicture(_result, args, cache, _info) {
              cache.invalidate({
                __typename: 'Picture',
                id: (args!.input! as { id: number }).id,
              });
            },
            createPicture(result, _args, cache, _info) {
              cache.updateQuery({ query: PicturesQueryDocument }, (data) => {
                data!.pictures!.push(result.createPicture!.picture!);
                data!.pictures!.sort((a, b) => a.rank - b.rank);
                return data;
              });
            },
            upsertInfoPage(result, _args, cache, _info) {
              cache.updateQuery({ query: InfoPagesQueryDocument }, (data) => {
                if (
                  !data!.infoPages?.some(
                    (ip) => ip.id === result.upsertInfoPage!.infoPage!.id
                  )
                ) {
                  data!.infoPages!.push(result.upsertInfoPage!.infoPage!);
                }
                data!.infoPages!.sort((a, b) => a.rank - b.rank);
                return data;
              });
            },
            upsertEventTag(_result, _args, cache, _info) {
              const key = 'Query';
              cache
                .inspectFields(key)
                .filter((field) => field.fieldName === 'eventTagsConnection')
                .forEach((field) => {
                  cache.invalidate(key, field.fieldName, field.arguments);
                });
            },
            upsertNews(_result, _args, cache, _info) {
              const key = 'Query';
              cache
                .inspectFields(key)
                .filter((field) => field.fieldName === 'newsesConnection')
                .forEach((field) => {
                  cache.invalidate(key, field.fieldName, field.arguments);
                });
            },
          },
        },
        keys: {
          EventTr: (data) => `${data.languageCode}|${data.eventId}`,
          PageTr: (data) => `${data.languageCode}|${data.pageId}`,
          GroupTr: (data) => `${data.languageCode}|${data.groupId}`,
          EventTagTr: (data) => `${data.languageCode}|${data.tagId}`,
          NewsTr: (data) => `${data.languageCode}|${data.newsId}`,
          InfoPageTr: (data) => `${data.languageCode}|${data.infoPageId}`,
          EventViaGroup: (data) => `${data.eventId}|${data.groupId}`,
          EventViaEventTag: (data) => `${data.eventId}|${data.tagId}`,
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
            ) {
              return true;
            }
          }

          if (accessToken.value) {
            const { exp } = jwtDecode(accessToken.value) as {
              exp: number;
            };
            return Date.now() >= exp * 1000;
          }

          return false;
        },
      }),
      ssr,
      lastExchange,
    ],
  });
}

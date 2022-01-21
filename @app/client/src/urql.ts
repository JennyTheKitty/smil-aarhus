import {
  CreatePictureMutation,
  EventTagTr,
  EventTr,
  EventViaEventTag,
  EventViaGroup,
  GroupTr,
  InfoPage,
  InfoPagesQueryDocument,
  InfoPageTr,
  NewsTr,
  Page,
  PageTr,
  PicturesQueryDocument,
  UpsertInfoPageMutation,
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
import { cacheExchange, DataFields } from '@urql/exchange-graphcache';
import jwtDecode from 'jwt-decode';

import { accessToken } from './accessToken';

const Narrow = <T>(v: any): v is T => true;

export function createClient(lastExchange: Exchange, ssr: Exchange): Client {
  return urqlCreateClient({
    // @ts-ignore
    // eslint-disable-next-line no-undef
    url: `${__ROOT_URL__}/graphql`,

    exchanges: [
      ...(import.meta.env.DEV ? [devtoolsExchange] : []),
      dedupExchange,
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
            reorderPictures(_result, args, cache, _info) {
              cache.updateQuery({ query: PicturesQueryDocument }, (data) => {
                const pictures = data!.pictures!.nodes;
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
                data!.pictures!.nodes.sort((a, b) => a.rank - b.rank);
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
              if (Narrow<NonNullable<CreatePictureMutation>>(result)) {
                cache.updateQuery({ query: PicturesQueryDocument }, (data) => {
                  data!.pictures!.nodes.push(result.createPicture!.picture!);
                  data!.pictures!.nodes.sort((a, b) => a.rank - b.rank);
                  return data;
                });
              }
            },
            upsertInfoPage(result, _args, cache, _info) {
              if (Narrow<NonNullable<UpsertInfoPageMutation>>(result)) {
                cache.updateQuery({ query: InfoPagesQueryDocument }, (data) => {
                  data!.infoPages!.nodes.push(result.upsertInfoPage!.infoPage!);
                  data!.infoPages!.nodes.sort((a, b) => a.rank - b.rank);
                  return data;
                });
              }
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
          NewsTr: (data) =>
            `${(data as NewsTr).languageCode}|${(data as NewsTr).newsId}`,
          InfoPageTr: (data) =>
            `${(data as InfoPageTr).languageCode}|${
              (data as InfoPageTr).infoPageName
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
          InfoPage: (data) => (data as InfoPage).name,
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

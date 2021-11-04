import type { ApolloCache, ApolloLink } from "@apollo/client/core";
import { ApolloClient,HttpLink } from "@apollo/client/core";

export function createApolloClient(
  ssr = false,
  cache: ApolloCache<any>,
  apolloLink: ApolloLink | undefined,
  csrfToken: string
) {
  let link;
  if (!import.meta.env.SSR || !apolloLink) {
    link = new HttpLink({
      // You should use an absolute URL here
      // @ts-ignore
      // eslint-disable-next-line no-undef
      uri: `${__ROOT_URL__}/graphql`,
      // credentials: 'include', // use 'same-origin' if it is appropriate for your case
      // headers: { 'CSRF-Token': getToken() },
      //   headers: { 'CSRF-Token': csrfToken },
    });
  } else {
    link = apolloLink;
  }
  console.log("apollo ssr", ssr);
  const apolloClient = new ApolloClient({
    link,
    cache,
    ...(ssr
      ? {
          // Set this on the server to optimize queries when SSR
          ssrMode: true,
        }
      : {
          // This will temporary disable query force-fetching
          ssrForceFetchDelay: 100,
        }),
  });

  return apolloClient;
}

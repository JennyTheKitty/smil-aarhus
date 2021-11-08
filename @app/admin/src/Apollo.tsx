import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

import { accessToken } from './accessToken';

const authLink = setContext((_, { headers }) => {
  const token = accessToken.getToken();
  console.log(token);
  if (!token) return { headers: headers };
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = new HttpLink({
  uri: '/admin/graphql',
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.error(
        '[GraphQL error]: Message:',
        err.message,
        'Location(s):',
        err.locations,
        'Path:',
        err.path
      );
    }
  }
  if (networkError) {
    console.warn(
      '[Network error]:',
      networkError,
      'Operation:',
      operation.operationName
    );
  }
});

const tokenLink = new TokenRefreshLink({
  isTokenValidOrUndefined:
    accessToken.isTokenValidOrUndefined.bind(accessToken),
  fetchAccessToken: accessToken.innerFetch.bind(accessToken),
  handleFetch: accessToken.handleFetch.bind(accessToken),
  handleError: accessToken.handleFetchError.bind(accessToken),
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: ApolloLink.from([tokenLink, errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;

import {
  AuthenticateDocument,
  GetMeDocument,
  LogoutDocument,
} from '@app/graphql/dist/admin';
import { AuthProvider } from 'ra-core';

import { accessToken } from './accessToken';
import client from './Apollo';

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const { data } = await client.mutate({
      mutation: AuthenticateDocument,
      variables: { username, password },
    });
    if (data) {
      accessToken.setToken(data.authenticate);
    } else {
      throw new Error('Error??');
    }
  },
  checkError: (error) => {
    console.log('checkerror', error);
    const status = error.status;
    if (status === 401 || status === 403) {
      accessToken.setToken('');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: async () => {
    if (!accessToken.getToken() || !accessToken.isTokenValidOrUndefined()) {
      await accessToken.fetchNewToken();
    }
  },
  logout: async () => {
    accessToken.setToken('');
    const { data } = await client.mutate({
      mutation: LogoutDocument,
    });
    if (!data || !data.logout) {
      throw new Error('Could not log out.');
    }
  },
  getIdentity: async () => {
    const { data } = await client.query({
      query: GetMeDocument,
    });
    if (!data || !data.currentMember) {
      throw new Error('Could not get logged in user.');
    }
    const { id, userRole, name } = data.currentMember;
    return { id, fullName: `${name} (${userRole})` };
  },
  // authorization
  getPermissions: async () => {
    /* ... */
  },
};

export default authProvider;

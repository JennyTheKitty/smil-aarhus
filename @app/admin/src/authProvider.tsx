import { gql } from "@apollo/client";
import { AuthProvider } from "ra-core";

import { accessToken } from "./accessToken";
import client from "./Apollo";

const LOGIN_MUTATION = gql`
  mutation Authenticate($username: String!, $password: String!) {
    authenticate(input: { username: $username, password: $password })
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

const GET_ME_QUERY = gql`
  query GetMe {
    currentMember {
      name,
      id,
      userRole
    }
  }
`;

const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const response = await client.mutate({
      mutation: LOGIN_MUTATION,
      variables: { username, password },
    });
    const {
      data: { authenticate: jwtToken },
    } = response;

    if (jwtToken) {
      accessToken.setToken(jwtToken);
    } else {
      throw new Error("Error??");
    }
  },
  checkError: (error) => {
    console.log("checkerror", error);
    const status = error.status;
    if (status === 401 || status === 403) {
      accessToken.setToken("");
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
    accessToken.setToken("");
    const response = await client.mutate({
      mutation: LOGOUT_MUTATION,
    });
    const {
      data: { logout: success },
    } = response;
    if (!success) {
      throw new Error("Could not log out.");
    }
  },
  getIdentity: async () => {
    const {
      data: {
        currentMember: { name, id, userRole },
      },
    } = await client.query({
      query: GET_ME_QUERY,
    });
    return { id, fullName: `${name} (${userRole})` };
  },
  // authorization
  getPermissions: async () => {
    /* ... */
  },
};

export default authProvider;

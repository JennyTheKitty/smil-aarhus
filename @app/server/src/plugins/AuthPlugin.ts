import { gql, makeExtendSchemaPlugin } from "graphile-utils";
import { sign, SignOptions } from "jsonwebtoken";
import { Context } from "koa";

import { getAuthPgPool } from "../databasePools";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_COOKIE_NAME } =
  process.env;

const AuthPlugin = makeExtendSchemaPlugin((_, { pgJwtSignOptions }) => ({
  typeDefs: gql`
    input AuthenticateInput {
      username: String!
      password: String!
    }
    extend type Mutation {
      authenticate(input: AuthenticateInput!): String!
      logout: Boolean
    }
  `,
  resolvers: {
    Mutation: {
      authenticate: async (_, args, context) => {
        const { username, password } = args.input;
        try {
          const {
            rows: [tokenPlaintext],
          } = await getAuthPgPool().query(
            ` SELECT member.*
              FROM smil_aarhus_private.authenticate($1, $2) member
              WHERE NOT (member is null)
              LIMIT 1
            `,
            [username, password]
          );
          if (!tokenPlaintext) {
            // unable to auth/invalid creds
            throw new Error("not authenticated");
          }
          console.log(">>", tokenPlaintext);
          const { sub, role } = tokenPlaintext;

          const accessToken = signToken(
            sub,
            role,
            pgJwtSignOptions,
            ACCESS_TOKEN_SECRET!
          );
          const refreshToken = signToken(
            sub,
            role,
            { ...pgJwtSignOptions, expiresIn: "7 days" },
            REFRESH_TOKEN_SECRET!
          );
          sendRefreshToken(context.ctx, refreshToken);
          return accessToken;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      logout: async (_, __, context) => {
        try {
          sendRefreshToken(context.ctx, null);
          return true;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
    },
  },
}));

export default AuthPlugin;

export const signToken = (
  sub: string,
  userRole: string,
  pgJwtSignOptions: SignOptions,
  secret: string
) => {
  const token = {
    sub,
    role: userRole,
  };

  return sign(
    token,
    secret,
    Object.assign(
      {},
      pgJwtSignOptions,
      pgJwtSignOptions && pgJwtSignOptions.audience
        ? null
        : { audience: "postgraphile" },
      pgJwtSignOptions && pgJwtSignOptions.issuer
        ? null
        : { issuer: "postgraphile" },
      pgJwtSignOptions && pgJwtSignOptions.expiresIn
        ? null
        : { expiresIn: "15 mins" }
    )
  );
};

export const sendRefreshToken = (ctx: Context, token: string | null) => {
  ctx.cookies.set(REFRESH_TOKEN_COOKIE_NAME!, token, {
    httpOnly: true,
    sameSite: true,
    path: "/access_token",
  });
};

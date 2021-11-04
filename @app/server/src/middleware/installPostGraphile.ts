import PgSimplfyInflector from "@graphile-contrib/pg-simplify-inflector";
import Router from "@koa/router";
import { NodePlugin } from "graphile-build";
import Koa from "koa";
import {
  makeAddInflectorsPlugin,
  postgraphile,
  PostGraphileOptions,
} from "postgraphile";
import PgConnectionFilter from "postgraphile-plugin-connection-filter";
// @ts-ignore
import PgFulltextFilterPlugin from "postgraphile-plugin-fulltext-filter";

import { getAuthPgPool } from "../databasePools";
import AuthPlugin from "../plugins/AuthPlugin";
import handleErrors from "../utils/handleErrors";

const isDev = process.env.NODE_ENV === "development";

const PersonPlugin = makeAddInflectorsPlugin((inflection) => {
  return {
    inputType(typeName: string) {
      if (typeName == "Member") {
        // This is never actually included in the graphql schema
        return "Fish";
      }
      if (typeName == "MemberInputRecord") {
        return "MemberInput";
      }
      return inflection.upperCamelCase(`${typeName}-input`);
    },
  };
}, true);

export const postgraphileOptions: PostGraphileOptions = {
  graphiql: isDev,
  allowExplain: isDev,
  watchPg: isDev,
  enhanceGraphiql: true,
  subscriptions: true,
  dynamicJson: true,
  enableQueryBatching: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: true,
  disableQueryLog: true,
  handleErrors,
  legacyRelations: "omit",
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  pgDefaultRole: "smil_anonymous",
  jwtPgTypeIdentifier: "smil_aarhus.jwt_token",
  ownerConnectionString: process.env.ROOT_DATABASE_URL,
  skipPlugins: [NodePlugin],
  sortExport: true,
  graphileBuildOptions: {
    pgStrictFunctions: true,
  },
  additionalGraphQLContextFromRequest: async (msg) => {
    return {
      ctx: msg._koaCtx,
    };
  },
};

export const postgraphileClientMiddleware = postgraphile(
  getAuthPgPool(),
  "smil_aarhus",
  {
    ...postgraphileOptions,
    appendPlugins: [PgSimplfyInflector, PgConnectionFilter],
    exportGqlSchemaPath: isDev
      ? `${__dirname}/../../../../data/schema.graphql`
      : undefined,
  }
);

const postgraphileAdminMiddleware = postgraphile(
  getAuthPgPool(),
  "smil_aarhus_admin",
  {
    ...postgraphileOptions,
    appendPlugins: [
      PgSimplfyInflector,
      PgConnectionFilter,
      PgFulltextFilterPlugin,
      AuthPlugin,
      //PersonPlugin,
    ],
    graphqlRoute: `/admin/graphql`,
    graphiqlRoute: `/admin/graphiql`,
    exportGqlSchemaPath: isDev
      ? `${__dirname}/../../../../data/admin-schema.graphql`
      : undefined,
  }
);

export default async function installPostGraphile(app: Koa, _router: Router) {
  app.use(postgraphileClientMiddleware);
  // https://github.com/graphile/postgraphile/pull/1548
  app.use((ctx, next) => {
    if (ctx.body == null) {
      return next();
    }
  });
  app.use(postgraphileAdminMiddleware);
  // https://github.com/graphile/postgraphile/pull/1548
  app.use((ctx, next) => {
    if (ctx.body == null) {
      return next();
    }
  });
}

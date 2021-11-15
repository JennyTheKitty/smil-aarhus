import PgSimplfyInflector from '@graphile-contrib/pg-simplify-inflector';
import Router from '@koa/router';
import { NodePlugin } from 'graphile-build';
import Koa from 'koa';
import { postgraphile, PostGraphileOptions } from 'postgraphile';
import PgConnectionFilter from 'postgraphile-plugin-connection-filter';

import { getAuthPgPool } from '../databasePools';
import AuthPlugin from '../plugins/AuthPlugin';
import CreateUploadUrlPlugin from '../plugins/CreateUploadUrlPlugin';
import ImageUrlSigningPlugin from '../plugins/ImageUrlSigningPlugin';
import handleErrors from '../utils/handleErrors';

const isDev = process.env.NODE_ENV === 'development';

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
  legacyRelations: 'omit',
  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
  pgDefaultRole: 'smil_anonymous',
  jwtPgTypeIdentifier: 'smil_aarhus.jwt_token',
  ownerConnectionString: process.env.DATABASE_URL,
  skipPlugins: [NodePlugin],
  sortExport: true,
  graphileBuildOptions: {
    pgStrictFunctions: true,
    connectionFilterAllowedOperators: [
      'isNull',
      'equalTo',
      'notEqualTo',
      'lessThan',
      'lessThanOrEqualTo',
      'greaterThan',
      'greaterThanOrEqualTo',
    ],
    connectionFilterArrays: false,
    connectionFilterComputedColumns: false,
    connectionFilterSetofFunctions: false,
    connectionFilterLogicalOperators: false,
    onnectionFilterAllowedFieldTypes: ['String', 'Int', 'DateTime'],
  },
  additionalGraphQLContextFromRequest: async (msg) => {
    return {
      ctx: msg._koaCtx,
    };
  },
};

export const postgraphileClientMiddleware = postgraphile(
  getAuthPgPool(),
  'smil_aarhus',
  {
    ...postgraphileOptions,
    appendPlugins: [
      PgSimplfyInflector,
      PgConnectionFilter,
      ImageUrlSigningPlugin,
      CreateUploadUrlPlugin,
      AuthPlugin,
    ],
    exportGqlSchemaPath: isDev
      ? `${__dirname}/../../../../data/schema.graphql`
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
}

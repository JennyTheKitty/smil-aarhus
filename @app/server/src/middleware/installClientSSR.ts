import Router from '@koa/router';
import {
  Exchange,
  makeErrorResult,
  makeResult,
  Operation,
  OperationResult,
} from '@urql/core';
import { execute, GraphQLSchema } from 'graphql';
import { IncomingMessage, ServerResponse } from 'http';
import Koa from 'koa';
import c2k from 'koa-connect';
import mount from 'koa-mount';
import serve from 'koa-static';
import { resolve as pathResolve } from 'path';
import { createSsrServer } from 'vite-ssr/dev';
import {
  filter,
  make,
  merge,
  mergeMap,
  onPush,
  pipe,
  share,
  Source,
  takeUntil,
} from 'wonka';

import { postgraphileClientMiddleware } from './installPostGraphile';

if (!process.env.NODE_ENV) {
  throw new Error('No NODE_ENV envvar! Try `export NODE_ENV=development`');
}
const isDev = process.env.NODE_ENV === 'development';

export interface Body {
  query?: string;
  operationName: string | undefined;
  variables: undefined | Record<string, any>;
  extensions: undefined | Record<string, any>;
}

const makeSource = (
  operation: Operation,
  req: IncomingMessage,
  res: ServerResponse
): Source<OperationResult> => {
  return make<OperationResult>(({ next, complete }) => {
    let ended = false;
    Promise.resolve()
      .then(() => {
        if (ended) return;
        return postgraphileClientMiddleware.getGraphQLSchema();
      })
      .then((schema: GraphQLSchema | void) => {
        if (!schema) return;
        return postgraphileClientMiddleware.withPostGraphileContextFromReqRes(
          req,
          res,
          {},
          (context) =>
            execute(schema, operation.query, {}, context, operation.variables)
        );
      })
      .then((data) => {
        return next(makeResult(operation, data));
      })
      .then(complete)
      .catch((error: Error) => {
        const result = makeErrorResult(operation, error, '');

        next(result);
        complete();
      });

    return () => {
      ended = true;
    };
  });
};

const GraphileExchange = (
  req: IncomingMessage,
  res: ServerResponse
): Exchange => {
  return ({ forward, dispatchDebug }) => {
    return (ops$) => {
      const sharedOps$ = share(ops$);

      const results$ = pipe(
        sharedOps$,
        filter((operation) => {
          return operation.kind === 'query' || operation.kind === 'mutation';
        }),
        mergeMap((operation) => {
          const { key } = operation;
          const teardown$ = pipe(
            sharedOps$,
            filter((op) => op.kind === 'teardown' && op.key === key)
          );

          return pipe(
            makeSource(operation, req, res),
            takeUntil(teardown$),
            onPush((result) => {
              const error = !result.data ? result.error : undefined;

              dispatchDebug({
                type: error ? 'fetchError' : 'fetchSuccess',
                message: `A ${
                  error ? 'failed' : 'successful'
                } fetch response has been returned.`,
                operation,
                data: {
                  url: '',
                  fetchOptions: {},
                  value: error || result,
                },
              });
            })
          );
        })
      );

      const forward$ = pipe(
        sharedOps$,
        filter((operation) => {
          return operation.kind !== 'query' && operation.kind !== 'mutation';
        }),
        forward
      );

      return merge([results$, forward$]);
    };
  };
};

export default async function installClientSSR(app: Koa) {
  const router = new Router();

  const resolve = (p: string) => pathResolve(__dirname + '/../../../client', p);
  app.use(async (ctx, next) => {
    const link = GraphileExchange(ctx.req, ctx.res);
    ctx.state.graphileExchange = link;
    await next();
  });

  if (isDev) {
    const root = resolve('.');
    const viteServer = await createSsrServer({
      root,
      // ssr: resolve('/src/server.js') // if you need seperate entry file for ssr
      logLevel: 'info',
      server: {
        middlewareMode: 'ssr',
        hmr: {
          port: 12345,
        },
      },
    });

    // Use vite's connect instance as middleware
    app.use(async (ctx) => {
      ctx.status = 200;
      const x = await c2k(viteServer.middlewares)(ctx, async () => {});
      return false;
    });
  } else {
    const dist = resolve(`./dist`);
    // This contains a list of static routes (assets)
    const { ssr } = await import(`${dist}/server/package.json`);
    // The manifest is importd for preloading assets
    const manifest = await import(`${dist}/client/ssr-manifest.json`);
    // This is the server renderer we just built
    const { default: renderPage } = await import(`${dist}/server`);
    // Serve every static asset route
    for (const asset of ssr.assets || []) {
      app.use(mount('/' + asset, serve(`${dist}/client/` + asset)));
    }
    app.use(mount('/', serve(`${dist}/client/`)));

    router.get('/(.*)', async (ctx, next) => {
      const url = ctx.protocol + '://' + ctx.get('host') + ctx.originalUrl;
      const { html, status, initialState } = await renderPage(url, {
        manifest,
        // https://github.com/vitejs/vite/issues/5120
        preload: false,
        response: ctx.res,
        request: ctx.req,
        // initialState: { ... } // <- This would also be available
      });
      if (!Object.hasOwnProperty.call(ctx.state, 'inlineScripts')) {
        ctx.state.inlineScripts = [];
      }
      ctx.state.inlineScripts.push(`window.__INITIAL_STATE__=${initialState}`);
      ctx.response.status = status || 200;
      ctx.response.body = html;
      await next();
    });
  }

  app.use(router.routes()).use(router.allowedMethods());
}

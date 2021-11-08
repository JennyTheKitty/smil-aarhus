import {
  ApolloLink,
  FetchResult,
  NextLink,
  Observable,
  Operation,
} from '@apollo/client';
import Router from '@koa/router';
import { execute, getOperationAST } from 'graphql';
import { IncomingMessage, ServerResponse } from 'http';
import Koa from 'koa';
import c2k from 'koa-connect';
import mount from 'koa-mount';
import serve from 'koa-static';
import { resolve as pathResolve } from 'path';
import { createSsrServer } from 'vite-ssr/dev';

import { postgraphileClientMiddleware } from './installPostGraphile';

if (!process.env.NODE_ENV) {
  throw new Error('No NODE_ENV envvar! Try `export NODE_ENV=development`');
}
const isDev = process.env.NODE_ENV === 'development';

/**
 * A Graphile Apollo link for use during SSR. Allows Apollo Client to resolve
 * server-side requests without requiring an HTTP roundtrip.
 */
export class GraphileApolloLink extends ApolloLink {
  constructor(private req: IncomingMessage, private res: ServerResponse) {
    super();
  }

  request(
    operation: Operation,
    _forward?: NextLink
  ): Observable<FetchResult> | null {
    return new Observable((observer) => {
      (async () => {
        try {
          const op = getOperationAST(operation.query, operation.operationName);
          if (!op || op.operation !== 'query') {
            if (!observer.closed) {
              /* Only do queries (not subscriptions) on server side */
              observer.complete();
            }
            return;
          }
          const schema = await postgraphileClientMiddleware.getGraphQLSchema();
          const data =
            await postgraphileClientMiddleware.withPostGraphileContextFromReqRes(
              this.req,
              this.res,
              {},
              (context) =>
                execute(
                  schema,
                  operation.query,
                  {},
                  context,
                  operation.variables,
                  operation.operationName
                )
            );
          if (!observer.closed) {
            observer.next(data);
            observer.complete();
          }
        } catch (e) {
          if (!observer.closed) {
            observer.error(e);
          } else {
            console.error(e);
          }
        }
      })();
    });
  }
}

export default async function installClientSSR(app: Koa, router: Router) {
  const resolve = (p: string) => pathResolve(__dirname + '/../../../client', p);
  app.use(async (ctx, next) => {
    const link = new GraphileApolloLink(ctx.req, ctx.res);
    ctx.state.graphileApolloLink = link;
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
    app.use(c2k(viteServer.middlewares));
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
    router.get('/(.*)', async (ctx, next) => {
      console.log(ctx.url);
      const url = ctx.protocol + '://' + ctx.get('host') + ctx.originalUrl;
      const { html, status, initialState } = await renderPage(url, {
        manifest,
        preload: true,
        response: ctx.res,
        request: ctx.req,
        // Anything passed here will be available in the main hook
        graphileApolloLink: ctx.state.graphileApolloLink,
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
}

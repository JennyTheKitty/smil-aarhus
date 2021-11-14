import Router from '@koa/router';
import Koa from 'koa';

import * as middleware from './middleware';
import { shutdownActions } from './shutdownActions';

export async function makeApp(): Promise<Koa> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    shutdownActions.push(() => {
      require('inspector').close();
    });
  }

  const app = new Koa();
  const router = new Router();

  await middleware.installCors(app, router);
  await middleware.installRefreshToken(app, router);
  await middleware.installPostGraphile(app, router);
  await middleware.installClientSSR(app, router);
  app.use(router.routes()).use(router.allowedMethods());
  await middleware.installHelmet(app, router);

  return app;
}

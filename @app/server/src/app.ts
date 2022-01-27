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

  await middleware.installCors(app);
  await middleware.installRefreshToken(app);
  await middleware.installPostGraphile(app);
  await middleware.installClientSSR(app);
  await middleware.installHelmet(app);

  return app;
}

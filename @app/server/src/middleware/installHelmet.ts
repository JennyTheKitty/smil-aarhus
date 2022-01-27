import crypto from 'crypto';
import helmet from 'helmet';
import Koa from 'koa';
import koaHelmet from 'koa-helmet';

const tmpRootUrl = process.env.ROOT_URL;

if (!tmpRootUrl || typeof tmpRootUrl !== 'string') {
  throw new Error('Envvar ROOT_URL is required.');
}
const ROOT_URL = tmpRootUrl;

const isDev = process.env.NODE_ENV === 'development';

function createSha256CspHash(content: string) {
  return (
    'sha256-' + crypto.createHash('sha256').update(content).digest('base64')
  );
}

const CSP_DIRECTIVES = {
  ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  'script-src': ["'self'"],
  'img-src': ["'self'", `img.${process.env.DOMAIN}`],
  'connect-src': [
    "'self'",
    'https://api.iconify.design',
    // Safari doesn't allow using wss:// origins as 'self' from
    // an https:// page, so we have to translate explicitly for
    // it.
    ROOT_URL.replace(/^http/, 'ws'),
    // ws://localhost:24678/
    ROOT_URL.replace(/^http/, 'ws').replace(/3000/, '24678'),
  ],
};

export default async function installHelmet(app: Koa) {
  app.use(async (ctx, next) => {
    // await next();
    const cspMiddleware = koaHelmet(
      isDev
        ? {
            contentSecurityPolicy: {
              directives: {
                ...CSP_DIRECTIVES,
                // Dev needs 'unsafe-eval' due to
                // https://github.com/vercel/next.js/issues/14221
                'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
              },
            },
          }
        : {
            contentSecurityPolicy: {
              directives: {
                ...CSP_DIRECTIVES,
                // "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
                'script-src': [
                  ...CSP_DIRECTIVES['script-src'],
                  "'unsafe-eval'",
                  ...(ctx.state.inlineScripts
                    ? [
                        ...Array.from(
                          ctx.state.inlineScripts as Array<string>
                        ).map((script) => `'${createSha256CspHash(script)}'`),
                      ]
                    : []),
                ],
              },
            },
            hsts: false,
          }
    );
    await cspMiddleware(ctx, next);
  });
}

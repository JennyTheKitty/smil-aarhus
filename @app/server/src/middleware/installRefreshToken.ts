import Router from '@koa/router';
import { TokenExpiredError, verify } from 'jsonwebtoken';
import Koa from 'koa';

import { getAuthPgPool } from '../databasePools';
import { sendRefreshToken, signToken } from '../plugins/AuthPlugin';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_COOKIE_NAME } =
  process.env;

export default async function installRefreshToken(app: Koa, router: Router) {
  router.post('/access_token', async (ctx, next) => {
    const token = ctx.cookies.get(REFRESH_TOKEN_COOKIE_NAME!);
    if (token) {
      try {
        const payload = verify(token, REFRESH_TOKEN_SECRET!, {
          algorithms: ['HS256'],
        });
        // user lookup - if user was deleted, they no longer get a token
        const { rows } = await getAuthPgPool().query(
          `SELECT id AS sub, is_active as "isActive", user_role AS "userRole"
                FROM smil_aarhus.member
                WHERE id = $1
                LIMIT 1`,
          [payload.sub]
        );
        if (rows.length) {
          const { sub, isActive, userRole } = rows[0];
          if (isActive) {
            // go ahead and refresh refresh token while we're here
            sendRefreshToken(
              ctx,
              signToken(
                sub,
                userRole,
                { expiresIn: '7 days' },
                REFRESH_TOKEN_SECRET!
              )
            );
            ctx.body = {
              ok: true,
              access_token: signToken(sub, userRole, {}, ACCESS_TOKEN_SECRET!),
            };
            return;
          }
        }
      } catch (err) {
        if (err instanceof TokenExpiredError) {
          sendRefreshToken(ctx, null);
        } else {
          console.error(err);
          next();
        }
      }
    }

    ctx.body = { ok: false, accessToken: '' };
  });
}

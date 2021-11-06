import { Pool } from "pg";

import { shutdownActions } from "./shutdownActions";

function swallowPoolError(_error: Error) {
  /* noop */
}

const rootPgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
rootPgPool.on("error", swallowPoolError);

const authPgPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
});
authPgPool.on("error", swallowPoolError);

export function getRootPgPool(): Pool {
  return rootPgPool;
}
export function getAuthPgPool(): Pool {
  return authPgPool;
}

shutdownActions.push(() => {
  rootPgPool.end();
});
shutdownActions.push(() => {
  authPgPool.end();
});

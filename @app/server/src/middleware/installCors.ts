import cors from "@koa/cors";
import Router from "@koa/router";
import Koa from "koa";

export default async function installCors(app: Koa, _router: Router) {
  const isDev = process.env.NODE_ENV === "development";
  const port = process.env.ADMIN_DEVSERVER_PORT || 3001;

  if (isDev) {
    app.use(
      cors({
        origin: `http://localhost:${port}`,
        credentials: true,
      })
    );
  }
} 
      
import Router from "@koa/router";
import Koa from "koa";
import c2k from "koa-connect";
import mount from "koa-mount";
import send from "koa-send";
import serve from "koa-static";
import { normalize as pathNormalize , resolve as pathResolve } from "path";
import { createServer } from "vite";

const isDev = process.env.NODE_ENV === "development";

export default async function installAdminStatic(app: Koa, router: Router) {
  if (isDev) {
    const root = pathResolve(__dirname + "/../../../admin");
    // Create vite server in middleware mode.
    const viteServer = await createServer({
      root,
      base: '/admin/',
      logLevel: "info",
      server: {
        middlewareMode: 'html',
      },
    });

    // Use vite's connect instance as middleware
    app.use(mount('/admin', c2k(viteServer.middlewares)));
  } else {
    const clientDistPath = pathNormalize(`${__dirname}/../../../admin/dist`);

    app.use(mount("/admin", serve(clientDistPath)));
    router.get("/admin/(.*)", async (ctx) => {
      await send(ctx, "index.html", { root: clientDistPath });
    });
  }
}

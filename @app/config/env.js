/* Use via `node -r @app/config/env path/to/file.js` */
require("dotenv").config({ path: `${__dirname}/../../.env` });

if (process.env.IS_ADMIN_DEVSERVER) {
  process.env.PORT = process.env.ADMIN_DEVSERVER_PORT;
}

if (process.env.IS_CLIENT_DEVSERVER) {
  process.env.PORT = process.env.CLIENT_DEVSERVER_PORT;
}
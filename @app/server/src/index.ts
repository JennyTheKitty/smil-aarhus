#!/usr/bin/env node
import { createServer } from 'http';

import { makeApp } from './app';
import { shutdownActions } from './shutdownActions';

async function main() {
  console.log('NODE_ENV is ', process.env.NODE_ENV);

  const app = await makeApp();

  const server = createServer(app.callback());

  // And finally, we open the listen port
  const PORT = parseInt(process.env.PORT || '', 10) || 3000;
  server.listen(PORT, () => {
    const address = server.address();
    if (address && typeof address !== 'string') {
      const href = `${process.env.ROOT_URL}/graphiql`;
      console.log(`PostGraphiQL available at ${href} 🚀`);
    } else {
      console.log(`PostGraphile listening on ${address} 🚀`);
    }
  });

  // Nodemon SIGUSR2 handling
  shutdownActions.push(() => {
    server.close();
  });
}

main().catch((e) => {
  console.error('Fatal error occurred starting server!');
  console.error(e);
  process.exit(101);
});

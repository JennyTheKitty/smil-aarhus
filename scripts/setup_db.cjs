#!/usr/bin/env node
const {
  yarnCmd,
  runMain,
  checkGit,
  outro,
  runSync,
  projectName,
} = require('./_setup_utils.cjs');
const inquirer = require('inquirer');
const pg = require('pg');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

runMain(async () => {
  await checkGit();

  // Ensure server build has been run
  runSync(yarnCmd, ['server', 'build']);

  // Source our environment
  const {
    DATABASE_AUTHENTICATOR,
    DATABASE_AUTHENTICATOR_PASSWORD,
    DATABASE_NAME,
    DATABASE_OWNER,
    DATABASE_OWNER_PASSWORD,
    ROOT_DATABASE_URL,
    CONFIRM_DROP,
  } = process.env;

  if (!CONFIRM_DROP) {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'CONFIRM',
        default: false,
        message: `We're going to drop (if necessary)`,
      },
    ]);
    if (!confirm.CONFIRM) {
      console.error('Confirmation failed; exiting');
      process.exit(1);
    }
  }

  console.log('Installing or reinstalling the roles and database...');
  const pgPool = new pg.Pool({
    connectionString: ROOT_DATABASE_URL,
  });

  pgPool.on('error', (err) => {
    // Ignore
    console.log(
      'An error occurred whilst trying to talk to the database: ' + err.message
    );
  });

  // Wait for PostgreSQL to come up
  let attempts = 0;
  while (true) {
    try {
      await pgPool.query('select true as "Connection test";');
      break;
    } catch (e) {
      if (e.code === '28P01') {
        throw e;
      }
      attempts++;
      if (attempts <= 30) {
        console.log(
          `Database is not ready yet (attempt ${attempts}): ${e.message}`
        );
      } else {
        console.log(`Database never came up, aborting :(`);
        process.exit(1);
      }
      await sleep(1000);
    }
  }

  const client = await pgPool.connect();
  try {
    const queries = [
      `DROP DATABASE IF EXISTS ${DATABASE_NAME}`,
      `DROP DATABASE IF EXISTS ${DATABASE_NAME}_shadow`,
      `DROP ROLE IF EXISTS ${DATABASE_OWNER}`,
      `DROP ROLE IF EXISTS ${DATABASE_AUTHENTICATOR}`,
      `DROP ROLE IF EXISTS smil_admin`,
      `DROP ROLE IF EXISTS smil_organizer`,
      `DROP ROLE IF EXISTS smil_anonymous`,

      `CREATE DATABASE ${DATABASE_NAME}`,
      `CREATE DATABASE ${DATABASE_NAME}_shadow`,

      `CREATE ROLE ${DATABASE_OWNER} SUPERUSER LOGIN PASSWORD '${DATABASE_OWNER_PASSWORD}'`,
      `CREATE ROLE ${DATABASE_AUTHENTICATOR} LOGIN PASSWORD '${DATABASE_AUTHENTICATOR_PASSWORD}'`,

      `CREATE ROLE smil_admin NOLOGIN`,
      `GRANT smil_admin TO ${DATABASE_AUTHENTICATOR}`,
      `CREATE ROLE smil_organizer NOLOGIN`,
      `GRANT smil_organizer TO ${DATABASE_AUTHENTICATOR}`,
      `CREATE ROLE smil_anonymous NOLOGIN`,
      `GRANT smil_anonymous TO ${DATABASE_AUTHENTICATOR}`,
    ];

    for (const query of queries) {
      console.log(query);
      await client.query(query);
    }
  } finally {
    await client.release();
  }
  await pgPool.end();

  runSync(yarnCmd, ['db', 'reset', '--erase']);
  runSync(yarnCmd, ['db', 'reset', '--shadow', '--erase']);

  outro(`\
✅ Setup success

🚀 To get started, run:

${
  projectName
    ? // Probably Docker setup
      '  export UID; docker-compose up server'
    : `  ${yarnCmd} start`
}`);
});

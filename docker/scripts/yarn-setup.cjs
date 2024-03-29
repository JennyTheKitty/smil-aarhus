const { runSync } = require("../../scripts/lib/run.cjs");
const { basename, dirname, resolve } = require("path");
const platform = require("os").platform();
const { safeRandomString } = require("../../scripts/lib/random.cjs");
const fs = require("fs");
const fsp = fs.promises;

const DOCKER_DOTENV_PATH = `${__dirname}/../.env`;

async function main() {
  // Check that docker/.env exists
  try {
    await fsp.access(DOCKER_DOTENV_PATH, fs.constants.F_OK);
  } catch (e) {
    // Does not exist, write it
    const password = safeRandomString(30);
    const data = `
# We'd like scripts ran through Docker to pretend they're in a normal
# interactive terminal.
FORCE_COLOR=2

# \`pg_dump\` is run from inside container, which doesn't have pg tools installed
# so it needs a way to still run it. \`docker-compose run\` would start an
# instance inside the current running container which doesn't work with volume
# mappings, so we must use \`docker-compose exec\`. \`-T\` is needed because our
# \`.gmrc\` checks for interactive TTY.
PG_DUMP="docker-compose exec -T db pg_dump"

# Drops tables without asking in \`yarn setup\`. Reasoning: 1) docker-compose is
# not tty, 2) it's a dev env anyway.
CONFIRM_DROP=y

# POSTGRES_PASSWORD is the superuser password for PostgreSQL, it's required to
# initialize the Postgres docker volume.
POSTGRES_PASSWORD=${password}

# We're accessing Postgres via Docker, so we must use the db host and the
# relevant password.
DATABASE_HOST=db
ROOT_DATABASE_URL=postgres://postgres:${password}@db/postgres

# Minio credentials
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=${safeRandomString(30)}

DOMAIN=localhost
`;
    await fsp.writeFile(DOCKER_DOTENV_PATH, data);
  }

  // The `docker-compose` project name defaults to the directory name containing
  // `docker-compose.yml`, which is the root folder of our project. Let's call
  // that 'ROOT'. We're in ROOT/docker/scripts and we want to get the name of
  // ROOT:
  const projectName = basename(dirname(dirname(resolve(__dirname))));

  // On Windows we must run 'yarn.cmd' rather than 'yarn'
  const yarnCmd = platform === "win32" ? "yarn.cmd" : "yarn";

  runSync(yarnCmd, ["down"]);
  runSync(yarnCmd, ["db:up"]);

  // Run setup as normal
  runSync(yarnCmd, [
    "compose",
    "run",
    "-e",
    `PROJECT_NAME=${projectName}`,
    "server",
    "yarn",
    "setup",
  ]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

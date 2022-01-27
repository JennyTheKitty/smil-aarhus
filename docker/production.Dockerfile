# Global args, set before the first FROM, shared by all stages
ARG PORT=5678
ARG NODE_ENV="production"
ARG ROOT_URL="http://localhost:${PORT}"

################################################################################
# Build stage 1 - `yarn build`

FROM node:17 as builder
# Import our shared args
ARG NODE_ENV
ARG ROOT_URL

# Cache node_modules for as long as possible
COPY lerna.json package.json yarn.lock /app/
COPY @app/ /app/@app/
WORKDIR /app/
RUN yarn install --frozen-lockfile --production=false --no-progress

COPY tsconfig.json /app/
# Folders must be copied separately, files can be copied all at once
COPY scripts/ /app/scripts/
COPY data/ /app/data/

# Finally run the build script
RUN yarn run build

################################################################################
# Build stage 2 - COPY the relevant things (multiple steps)

FROM node:17-alpine as clean
# Import our shared args
ARG NODE_ENV
ARG ROOT_URL

# Copy over selectively just the tings we need, try and avoid the rest
COPY --from=builder /app/lerna.json /app/package.json /app/yarn.lock /app/
COPY --from=builder /app/@app/client/package.json /app/@app/client/package.json
COPY --from=builder /app/@app/client/dist/ /app/@app/client/dist/
COPY --from=builder /app/@app/server/package.json /app/@app/server/
COPY --from=builder /app/@app/server/dist/ /app/@app/server/dist/

# Shared args shouldn't be overridable at runtime (because they're baked into
# the built JS).
#
# Further, they aren't available in ENTRYPOINT (because it's at runtime), so
# push them to a .env file that we can source from ENTRYPOINT.
RUN echo -e "NODE_ENV=$NODE_ENV\nROOT_URL=$ROOT_URL" > /app/.env


################################################################################
# Build stage FINAL - COPY everything, once, and then do a clean `yarn install`

FROM node:17-alpine

RUN apk --no-cache add git

WORKDIR /app/
# Copy everything from stage 2, it's already been filtered
COPY --from=clean /app/ /app/


# Import our shared args
ARG PORT
ARG NODE_ENV
ARG ROOT_URL

LABEL description="SMil Aarhus Server"

# You might want to disable GRAPHILE_TURBO if you have issues
ENV GRAPHILE_TURBO=1 PORT=$PORT

# Entrypoint last so that we can run `sh` in previous build steps for debugging
ENTRYPOINT yarn "${TARGET}" start

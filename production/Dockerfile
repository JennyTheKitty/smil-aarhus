# Global args, set before the first FROM, shared by all stages
ARG PORT=5678
ARG NODE_ENV="production"

################################################################################
# Build stage 1 - `yarn build`

FROM node:17-alpine as builder
ARG NODE_ENV

COPY lerna.json package.json yarn.lock tsconfig.json .yarnrc.yml /app/
COPY @app/ /app/@app/
COPY data/ /app/data/
COPY scripts/ /app/scripts/
COPY .yarn /app/.yarn/

WORKDIR /app/

RUN yarn install --immutable

ENV PATH="/app/node_modules/.bin/:${PATH}"

RUN yarn build

RUN mkdir /build/ && \
  cp lerna.json /build/ && \
  cp package.json /build/ && \
  cp yarn.lock /build/ && \
  cp .yarnrc.yml /build/ && \
  cp --parents @app/client/package.json /build/ && \
  cp --parents -r @app/client/dist/ /build/ && \
  cp --parents @app/server/package.json /build/ && \
  cp --parents -r @app/server/dist/ /build/ && \
  cp --parents @app/config/package.json /build/ && \
  cp --parents @app/config/env.js /build/ && \
  cp --parents -r @app/config/dist/ /build/ && \
  cp --parents @app/graphql/package.json /build/ && \
  cp --parents -r @app/graphql/dist/ /build/ && \
  cp --parents -r @app/db/ /build/

WORKDIR /app/@app/server/
RUN yarn prod-install /build

RUN echo -e "NODE_ENV=$NODE_ENV" > /build/.env

RUN rm -rf /build/.yarn/cache && \
  find /build/node_modules -name "*.d.ts" -type f -delete && \
  find /build/node_modules -name "*.flow" -type f -delete && \
  find /build/node_modules -name "*.map" -type f -delete && \
  rm -rf /build/node_modules/date-fns/fp && \
  rm -rf /build/node_modules/date-fns/esm && \
  rm -rf /build/node-modules/naive-ui/es

# ################################################################################
# # Build stage FINAL

FROM node:17-alpine
WORKDIR /app/
LABEL description="SMil Aarhus Server"
ENV GRAPHILE_TURBO=1 PORT=$PORT
ARG PORT
ARG NODE_ENV

COPY --from=builder /build .

EXPOSE 5678/tcp
ENTRYPOINT yarn node -r /app/@app/config/env /app/@app/server/dist/index.js

FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json apps/frontend/
RUN pnpm install --frozen-lockfile --filter frontend

COPY .nvmrc ./
COPY apps/frontend apps/frontend

ARG VITE_SWAPI_BASE_URL=https://swapi.info/api
ENV VITE_SWAPI_BASE_URL=$VITE_SWAPI_BASE_URL
RUN pnpm --filter frontend build

FROM nginx:alpine
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --start-period=15s --interval=30s --timeout=5s --retries=3 \
  CMD wget -q -O /dev/null http://0.0.0.0:8089/ || exit 1
EXPOSE 8089

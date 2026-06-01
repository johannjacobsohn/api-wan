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
RUN echo 'server { listen 80; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
HEALTHCHECK CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
EXPOSE 80

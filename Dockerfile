# syntax=docker/dockerfile:1.7
# Vite SPA + local @growise/web-sdk.
# Build from this directory:
#   docker build --build-context growise-sdk=../../../sdk/js -t growise-demo-ott .
FROM node:20-alpine AS sdk
WORKDIR /sdk
COPY --from=growise-sdk package.json package-lock.json ./
RUN npm ci
COPY --from=growise-sdk . .
RUN npm run build

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY --from=sdk /sdk /sdk/js
RUN npm pkg set 'dependencies.@growise/web-sdk'='file:/sdk/js' \
  && npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=5s \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]

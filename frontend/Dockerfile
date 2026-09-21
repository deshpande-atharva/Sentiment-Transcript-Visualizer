FROM node:20-alpine AS build

WORKDIR /app

# package-lock.json is resolved by npm 11; node:20-alpine bundles npm 10, which
# rejects that tree. Pin the package manager so `npm ci` is reproducible here,
# in CI and on developer machines.
RUN npm install -g npm@11.6.2

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src

# Create React App inlines REACT_APP_* at build time, so these must be build args.
# Anything passed here is baked into the public JS bundle - see README.
ARG REACT_APP_BACKEND_URL=http://localhost:8000
ARG REACT_APP_DEEPGRAM_API_KEY=""
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL \
    REACT_APP_DEEPGRAM_API_KEY=$REACT_APP_DEEPGRAM_API_KEY

RUN npm run build


# nginx-unprivileged runs as uid 101 on port 8080 with no root-owned runtime dirs.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["wget", "--quiet", "--tries=1", "--spider", "http://127.0.0.1:8080/healthz"]

# nginx forwards SIGTERM to its workers and exits cleanly under `docker stop`.
CMD ["nginx", "-g", "daemon off;"]

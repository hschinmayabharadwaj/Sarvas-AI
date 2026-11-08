# SARVAS on Render (free web service): FastAPI + Go agent-service + the Node page renderer.
# Vercel serves the static files (scripts, images, video) and forwards pages, /api and
# /auth here (see client/vercel.json), so pages are rendered on this server.
#
# Render settings: Root Directory = SARVAS, Dockerfile Path = deploy/render/Dockerfile,
# Docker Build Context = . (the SARVAS folder). Local check:
#   docker build -f deploy/render/Dockerfile -t sarvas-api .

# --- Go agent-service (static binary; the Modal Go SDK is the only non-stdlib dep)
FROM golang:1.25-bookworm AS agent
WORKDIR /src
COPY agent/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/agent-service ./cmd/agent-service

# --- React page: browser bundle (dist/) and server-render bundle (dist-ssr/)
FROM node:22-bookworm-slim AS client
WORKDIR /src
COPY client/package.json client/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY client/ ./
RUN npm run build

# --- Runtime: FastAPI + agent-service + page renderer, as a non-root user
FROM python:3.12-slim-bookworm
ENV PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1
# git: the Ask index keeps a local checkout of each repository.
RUN apt-get update \
    && apt-get install -y --no-install-recommends git ca-certificates libstdc++6 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY server/sarvas_web ./sarvas_web
COPY --from=agent /out/agent-service ./bin/agent-service
COPY --from=client /usr/local/bin/node /usr/local/bin/node
COPY --from=client /src/dist ./client/dist
COPY --from=client /src/dist-ssr ./client/dist-ssr
COPY --from=client /src/server.js ./client/server.js
COPY deploy/render/app.py deploy/render/config.json ./
RUN useradd -m -u 1000 app && mkdir data && chown app:app data
USER app
CMD ["python", "app.py"]

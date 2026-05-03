# pirate-bun

A torrent search API that queries a public torrent index and forwards results (or magnet links) directly to a qBittorrent instance via its Web API.

Ships with an optional Vite + ultra-light.js frontend for browser-based use.

## Stack

- **Server** — [Bun](https://bun.sh) + [Hono](https://hono.dev), TypeScript
- **Client** *(optional)* — Vite + [ultra-light.js](https://github.com/EvilPrime98/ultra-light-js), CSS Modules

## Requirements

- [Bun](https://bun.sh) ≥ 1.x
- A running qBittorrent instance with Web UI enabled
- [pnpm](https://pnpm.io) ≥ 10.x *(only needed if building the client)*

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Create a `.env` file at the project root:

```env
BASE_URL=<torrent-index-mirror-url>
QB_HOST=http://<qbittorrent-host>:<port>
QB_USER=<username>
QB_PASS=<password>
```

### 3. Run

**API only:**

```bash
bun run start
```

**API + client UI:**

```bash
cd client && pnpm install && pnpm run build && cd ..
bun run start
```

When the client is built, it is served statically from the same Bun HTTP server at `/`.

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/search?q=<term>&pages=<n>` | Search torrents (default: 3 pages) |
| `POST` | `/api/download` | Send a magnet link to qBittorrent |

### `GET /api/search`

**Query params**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | `string` | — | Search term *(required)* |
| `pages` | `number` | `3` | Number of result pages to fetch |

**Response**

```json
[
  {
    "title": "...",
    "magnet": "magnet:?xt=...",
    "seeders": 142,
    "leechers": 7,
    "lowSeeders": false
  }
]
```

`lowSeeders` is `true` when the seeder count falls below the warning threshold.

### `POST /api/download`

**Body**

```json
{ "magnet": "magnet:?xt=..." }
```

**Response** — `204 No Content` on success.

## Client (optional)

The bundled UI provides search, result listing, seeder warnings, and one-click download to qBittorrent. It is an optional convenience layer — every action it performs maps 1:1 to the API above.

```bash
# Install client deps (once)
cd client && pnpm install

# Dev server (hot reload, proxies /api to the Bun server)
cd client && pnpm run dev

# Production build (output goes to client/dist, served by the API server)
cd client && pnpm run build

# Lint
cd client && pnpm run lint
```

## Development

Run the API server and the client dev server in parallel:

```bash
# Terminal 1
bun run dev

# Terminal 2
cd client && pnpm run dev
```

The Vite dev server proxies `/api` requests to the Bun backend, so there is no CORS configuration needed during development.
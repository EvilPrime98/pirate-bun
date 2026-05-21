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

Create a `.env` file at the client root:

```env
VITE_API_URL=http://SERVER_IP:SERVER_PORT/api
```

```bash
cd client && pnpm install && pnpm run build && cd ..
bun run start
```

When the client is built, it is served statically from the same Bun HTTP server at `/`.

# API Reference

## `GET /`

### Required

| Param | Type | Description |
|---|---|---|
| `search` | string | Search term |

### Optional

| Param | Type | Default |
|---|---|---|
| `pages` | integer | `3` |

---

## Filters

### `category`
Filters results where the category **contains** the value (case-insensitive).

```
GET /?search=ubuntu&category=video
```

---

### `subcategory`
Filters results where the subcategory **contains** the value (case-insensitive).

```
GET /?search=ubuntu&subcategory=movies
```

---

### `uploadBy`
Filters results where the uploader name **contains** the value (case-insensitive).

```
GET /?search=ubuntu&uploadBy=yify
```

---

### `minSeeders` / `maxSeeders`
Filters by seeder count. Both are optional and combinable.

```
GET /?search=ubuntu&minSeeders=100&maxSeeders=5000
```

| Params | Behavior |
|---|---|
| `minSeeders` only | `seeders >= min` |
| `maxSeeders` only | `seeders <= max` |
| Both | `min <= seeders <= max` |

---

### `minLeechers` / `maxLeechers`
Filters by leecher count. Same logic as seeders.

```
GET /?search=ubuntu&minLeechers=10&maxLeechers=500
```

| Params | Behavior |
|---|---|
| `minLeechers` only | `leechers >= min` |
| `maxLeechers` only | `leechers <= max` |
| Both | `min <= leechers <= max` |

---

### `uploadAt`
Filters results uploaded on an exact date. **Ignored** if `uploadAfter` or `uploadBefore` is present.

```
GET /?search=ubuntu&uploadAt=2024-03-15
```

- Format: `YYYY-MM-DD`
- Mutually exclusive with `uploadAfter` / `uploadBefore`

---

### `uploadAfter`
Filters results uploaded after the given date (day-exclusive). **Ignored** if `uploadAt` is present.

```
GET /?search=ubuntu&uploadAfter=2024-01-01
```

- Format: `YYYY-MM-DD`

---

### `uploadBefore`
Filters results uploaded before the given date (day-exclusive). **Ignored** if `uploadAt` is present.

```
GET /?search=ubuntu&uploadBefore=2024-12-31
```

- Format: `YYYY-MM-DD`

---

### `limit`
Caps the number of results. Applied last, after all filters and sorts.

```
GET /?search=ubuntu&limit=10
```

- If omitted, all matching results are returned

---

## Sorts

Applied after all filters, before `limit`. Providing multiple sort params applies them in this order: seeders → leechers → size — the last one wins.

### `sortBySeeders`
Sorts by seeder count descending (highest first).

```
GET /?search=ubuntu&sortBySeeders=1
```

### `sortBySeedersASC`
Sorts by seeder count ascending (lowest first). Takes priority over `sortBySeeders` when both are present.

```
GET /?search=ubuntu&sortBySeedersASC=1
```

### `sortByLeechers`
Sorts by leecher count descending.

```
GET /?search=ubuntu&sortByLeechers=1
```

### `sortByLeechersASC`
Sorts by leecher count ascending.

```
GET /?search=ubuntu&sortByLeechersASC=1
```

### `sortBySize`
Sorts by file size descending (largest first). Handles `MiB` and `GiB` units.

```
GET /?search=ubuntu&sortBySize=1
```

### `sortBySizeASC`
Sorts by file size ascending (smallest first).

```
GET /?search=ubuntu&sortBySizeASC=1
```

---

## `POST /download`

Sends a magnet link to the qBittorrent client.

### Body

```json
{ "magnet": "magnet:?xt=urn:btih:..." }
```

### Response

```json
{
  "error": false,
  "message": "Download successful",
  "entry": "..."
}
```

---

## Full example

```
GET /?search=ubuntu&category=video&minSeeders=50&sortBySeeders=1&limit=5
```

Returns the top 5 most-seeded video results for "ubuntu" with at least 50 seeders.

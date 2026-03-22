# README

# Welcome to the game, at Hack Club!

## Getting Started

### Prerequisites

- Ruby 3.4.7
- Node.js 22+
- PostgreSQL (via Docker)

### Database Setup

Run Postgres in a Docker container:

```bash
docker run -d \
  --name game-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:16
```

This matches the `DATABASE_URL` in `.env`.

```
DATABASE_URL="postgres://postgres:password@localhost:5432/game_development"
```

To setup the database:

```bash
bin/rails db:prepare
```

### Development

Start the dev server:

```bash
bin/dev
```

### Services

- **Job Queue**: Development uses `:async` (in-process). Production uses Sidekiq (Redis).
- **Cache**: Development uses `:memory_store`. Production uses Redis.

# Cloudflare Workers

Cloudflare Worker scripts, configuration, and binding definitions.

## Structure

```
cloudflare-workers/
└── <worker-name>/
    ├── README.md        # Worker overview and deployment notes
    ├── wrangler.toml    # Wrangler configuration (bindings, routes, env)
    ├── src/
    │   └── index.ts     # Worker entry point
    └── ...
```

## Conventions

- One directory per Worker.
- Use `wrangler.toml` for all binding and environment configuration.
- Secrets are stored in the Cloudflare dashboard — never commit them here.
- Compatible with the [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/).

## Quick Start

```bash
cd cloudflare-workers/<worker-name>
npm install
npx wrangler dev   # local development
npx wrangler deploy
```

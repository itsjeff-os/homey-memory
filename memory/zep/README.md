# Memory — Zep

Zep memory server configuration and session scaffolds.

## Contents

```
zep/
├── config/            # Zep server config files
└── sessions/          # Example session and user schema definitions
```

## Setup

Run Zep with Docker:

```bash
docker pull ghcr.io/getzep/zep:latest
docker run -p 8000:8000 ghcr.io/getzep/zep
```

## Environment Variables

```
ZEP_API_URL=http://localhost:8000
ZEP_API_KEY=          # if authentication is enabled
```

## References

- [Zep Documentation](https://docs.getzep.com/)

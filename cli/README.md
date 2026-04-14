# openclaw-azure-cli (MVP)

Installable CLI to deploy the OpenClaw Azure infrastructure without forking the repo.

## Commands

- `openclaw-azure init`
- `openclaw-azure deploy`

## Local development

```bash
cd cli
npm install
npm run build
node dist/index.js help
```

## Notes

1. This MVP uses direct Azure auth (`az login`).
2. Telegram token is prompted at deploy time and not persisted.
3. Local CLI state is stored in `.openclaw-azure/` under the project root.

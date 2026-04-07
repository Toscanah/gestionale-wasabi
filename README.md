This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Docker Deployment Workflow

For deployment machines, keep only the runtime essentials:

- `.env`
- `docker-compose.yml`
- `main.js`
- `scripts/docker/Start-Docker.ps1`

`Start-Docker.ps1` is now a standalone control menu that opens a new terminal for each operation.

### Menu Options

1. Start System
: Starts Docker services, launches Electron with `main.js`, runs automatic backup on app close, then stops containers.

2. Manual Backup
: Runs `docker compose run --rm backup`.

3. Manual Restore
: Runs `docker compose run --rm restore` and restores from local `./backup` dump.

### Shortcut Parameters

```powershell
# Open worker terminal and run start flow
.\scripts\docker\Start-Docker.ps1 -Action start

# Open worker terminal and run manual backup
.\scripts\docker\Start-Docker.ps1 -Action backup

# Open worker terminal and run manual restore
.\scripts\docker\Start-Docker.ps1 -Action restore
```

### Backup Modes

1. Sidecar backup (default)
: Runs only when explicitly triggered from startup/shutdown scripts.

2. Entrypoint shutdown hook (optional)
: Enable `ENABLE_BACKUP_ON_STOP=1` in `.env` to run backup automatically when the `app` container receives a stop signal.

Backups are written to the host `./backup` folder.

Backup policy:

- Daily backup file format: `gestionale-wasabi-YYYYMMDD.dump` (one file per day, overwritten if run multiple times the same day)
- A rolling pointer file is always updated: `latest.dump`
- Retention keeps only the most recent 31 daily files; older daily files are deleted automatically
- Restore always reads from `latest.dump`

### Manual Backup / Restore

```powershell
# One-off backup via compose service
docker compose run --rm backup

# One-off restore via compose service
docker compose run --rm restore
```

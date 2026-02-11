# Vaultbrix Status Page

Real-time status monitoring for Vaultbrix services at **status.vaultbrix.com**.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  uptime.yml (every 5 min)                           │    │
│  │  - Check all endpoints                              │    │
│  │  - Update history/*.json                            │    │
│  │  - Update api/status.json                           │    │
│  │  - Commit changes                                   │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Vercel                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Next.js Static Site                                │    │
│  │  - Reads api/status.json                            │    │
│  │  - Displays service status                          │    │
│  │  - Shows uptime graphs                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  URL: status.vaultbrix.com                                  │
└─────────────────────────────────────────────────────────────┘
```

## Monitored Services

| Service | URL | Check Interval |
|---------|-----|----------------|
| API | https://api.vaultbrix.com/health | 5 min |
| Dashboard | https://app.vaultbrix.com | 5 min |
| Website | https://vaultbrix.com | 5 min |
| Auth Service | https://api.vaultbrix.com/v1/auth/health | 5 min |

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run status check manually
npm run check
```

## Deployment

This repo is deployed to Vercel with automatic deployments on push to `main`.

### DNS Configuration

Add a CNAME record:
```
status.vaultbrix.com -> cname.vercel-dns.com
```

## File Structure

```
vaultbrix-status/
├── .github/workflows/
│   └── uptime.yml          # Monitoring workflow
├── api/
│   └── status.json         # Current status (auto-updated)
├── history/                 # Historical data (auto-updated)
├── scripts/
│   └── check-status.js     # Endpoint checker
├── src/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   └── lib/                # Utilities
├── upptime.yml             # Monitoring configuration
├── vercel.json             # Vercel configuration
└── package.json
```

## Status Definitions

| Status | Color | Description |
|--------|-------|-------------|
| Operational | Green | All systems working |
| Degraded | Yellow | Partial outage or slow |
| Down | Red | Service unavailable |

## License

MIT - Vaultbrix 2026

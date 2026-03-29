# Deployment Guide — Helbreath Online

## Server Layout

```
/opt/hbonline/
├── .env                    # Production environment (from deploy/.env.production)
├── server/
│   ├── gameserver          # Compiled Go binary
│   └── assets/MAPDATA/     # Map files
├── client/
│   └── dist/               # Vite build output
├── nginx/
│   └── hbonline.conf       # Symlinked to /etc/nginx/sites-enabled/
└── deploy/
    ├── hbonline.service    # Symlinked to /etc/systemd/system/
    └── setup.sh
```

## Prerequisites

```bash
apt update && apt install -y nginx postgresql-16 golang-go nodejs npm
```

## Initial Setup

```bash
# Clone or copy the repo to /opt/hbonline
sudo bash /opt/hbonline/deploy/setup.sh
```

## Build & Deploy

### Server

```bash
cd /opt/hbonline/server
# Build from source (or copy pre-built binary)
GOOS=linux GOARCH=amd64 go build -o gameserver ./cmd/gameserver
```

### Client

```bash
cd /opt/hbonline/client
npm install
npm run build   # Reads .env.production automatically
```

### Database

```bash
sudo -u postgres createuser hbonline -P   # Set the password
sudo -u postgres createdb hbonline -O hbonline
psql -U hbonline -d hbonline -f /opt/hbonline/migrations/001_initial.sql
psql -U hbonline -d hbonline -f /opt/hbonline/migrations/002_inventory_skills_and_missing_fields.sql
```

## Service Management

```bash
sudo systemctl start hbonline       # Start server
sudo systemctl stop hbonline        # Stop server
sudo systemctl restart hbonline     # Restart
sudo systemctl status hbonline      # Check status

# Logs
tail -f /var/log/hbonline/server.log
journalctl -u hbonline -f           # Alternative via journald
```

## SSL Setup

### Option A: Cloudflare Origin Certificate (recommended with Cloudflare proxy)

1. In Cloudflare dashboard: SSL/TLS > Origin Server > Create Certificate
2. Save the cert and key to the server:
   ```bash
   sudo mkdir -p /etc/ssl/cloudflare
   # Paste cert to /etc/ssl/cloudflare/helbreath.xyz.pem
   # Paste key to /etc/ssl/cloudflare/helbreath.xyz.key
   sudo chmod 600 /etc/ssl/cloudflare/helbreath.xyz.key
   ```
3. Uncomment the SSL lines in `nginx/hbonline.conf`
4. Set Cloudflare SSL mode to **Full (Strict)**

### Option B: Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d helbreath.xyz -d api.helbreath.xyz -d cdn.helbreath.xyz
```

Then uncomment the Let's Encrypt lines in the nginx config.

## CDN / Cloudflare

- All three subdomains should be proxied through Cloudflare (orange cloud)
- `cdn.helbreath.xyz` benefits most from caching — assets have 30-day cache headers
- After deploying new assets, purge the Cloudflare cache:
  - Zone purge: Cloudflare dashboard > Caching > Purge Everything
  - Or selective: `curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" -H "Authorization: Bearer TOKEN" -d '{"files":["https://cdn.helbreath.xyz/assets/..."]}'`
- Vite-hashed JS/CSS files (e.g. `index-a1b2c3d4.js`) are immutable — no purge needed on redeploy

## Updating

```bash
cd /opt/hbonline
git pull

# Rebuild server
cd server && go build -o gameserver ./cmd/gameserver

# Rebuild client
cd ../client && npm run build

# Restart
sudo systemctl restart hbonline

# If assets changed, purge CDN cache
```

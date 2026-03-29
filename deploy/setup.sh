#!/usr/bin/env bash
# =============================================================================
# Helbreath Online — Server Setup Script (Hetzner / Ubuntu/Debian)
# =============================================================================
# Run as root: sudo bash deploy/setup.sh
# =============================================================================
set -euo pipefail

export APP_DIR="/opt/helbreath.xyz"
export LOG_DIR="/var/log/helbreath.xyz"
export SERVICE_USER="helbreath.xyz"

echo "=== Creating service user ==="
if ! id "$SERVICE_USER" &>/dev/null; then
    useradd --system --no-create-home --shell /usr/sbin/nologin "$SERVICE_USER"
fi

echo "=== Creating directories ==="
mkdir -p "$APP_DIR"/{server,client/dist}
mkdir -p "$LOG_DIR"
chown "$SERVICE_USER":"$SERVICE_USER" "$LOG_DIR"

echo "=== Setting up log rotation ==="
cat > /etc/logrotate.d/helbreath.xyz <<'LOGROTATE'
/var/log/helbreath.xyz/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    copytruncate
}
LOGROTATE

echo "=== Installing systemd service ==="
cp "$APP_DIR/deploy/helbreath.xyz.service" /etc/systemd/system/helbreath.xyz.service
systemctl daemon-reload
systemctl enable helbreath.xyz.service

echo "=== Installing nginx config ==="
ln -sf "$APP_DIR/nginx/helbreath.conf" /etc/nginx/sites-enabled/helbreath.xyz.conf
# Remove default nginx site if it exists
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Copy .env.production to $APP_DIR/.env and fill in real values"
echo "  2. Build & deploy the server binary to $APP_DIR/server/gameserver"
echo "  3. Copy server/assets/MAPDATA to $APP_DIR/server/assets/MAPDATA"
echo "  4. Build the client (npm run build) and copy dist/ to $APP_DIR/client/dist/"
echo "  5. Set up SSL certificates (see nginx config comments)"
echo "  6. Start the server: sudo systemctl start helbreath.xyz"
echo "  7. Check logs: tail -f $LOG_DIR/server.log"
echo "     Or use journalctl: journalctl -u helbreath.xyz -f"

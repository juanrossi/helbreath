/**
 * Deployment-specific URLs, resolved at build time via Vite env vars.
 *
 * Development (localhost): everything points to the local dev server.
 * Production: set in client/.env.production:
 *   VITE_API_BASE   = https://api.helbreath.xyz
 *   VITE_WS_BASE    = wss://api.helbreath.xyz
 *   VITE_ASSET_BASE = https://cdn.helbreath.xyz
 */

const host = window.location.hostname;
const isLocal = host === 'localhost' || host === '127.0.0.1';

/** Base URL for REST API calls (no trailing slash) */
export const API_BASE: string =
  import.meta.env.VITE_API_BASE ?? (isLocal ? `http://${host}:8080` : '');

/** Base URL for WebSocket connections (no trailing slash) */
export const WS_BASE: string =
  import.meta.env.VITE_WS_BASE ??
  (isLocal
    ? `ws://${host}:8080`
    : `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`);

/** Base URL prefix for game assets — sprites, maps, sounds (no trailing slash) */
export const ASSET_BASE: string =
  import.meta.env.VITE_ASSET_BASE ?? '';

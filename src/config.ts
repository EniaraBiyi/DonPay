const env = import.meta.env;

/** Backend origin, no trailing slash. Empty = same origin (a proxy in dev, or a reverse proxy in production). */
export const API_URL: string = String(env.VITE_API_URL ?? '').replace(/\/$/, '');

const storageMock = typeof window !== 'undefined' ? window.localStorage?.getItem('paidar:mock') : null;

/**
 * Mock API.
 * - If VITE_MOCK or localStorage 'paidar:mock' is explicitly set, follow that ('true' / 'false').
 * - If a backend API_URL or DEV_PROXY is provided, default to real backend (MOCK = false).
 * - Otherwise (standalone static deploy or local dev with no backend), default to MOCK = true
 *   so the application is fully interactive and functional out-of-the-box.
 */
export const MOCK: boolean = storageMock !== null
  ? storageMock === 'true'
  : (env.VITE_MOCK !== undefined
      ? env.VITE_MOCK === 'true'
      : (!API_URL && !env.VITE_DEV_PROXY));

export const DEV_LOGIN: boolean = MOCK || env.VITE_DEV_LOGIN === 'true';
export const BOT_URL: string = String(env.VITE_TELEGRAM_BOT_URL ?? '');
export const SIMULATE: boolean = MOCK || env.VITE_SIMULATE_PAYMENTS === 'true';

/** Things that must never be true in a real release. Shown as a loud banner in production builds. */
export const RELEASE_RISKS: string[] = [];
if (!env.DEV) {
  if (env.VITE_MOCK === 'true' && API_URL) RELEASE_RISKS.push('Demo mode is on: nothing is saved to a server.');
  if (env.VITE_DEV_LOGIN === 'true' && !MOCK) RELEASE_RISKS.push('Developer sign-in is enabled.');
  if (env.VITE_SIMULATE_PAYMENTS === 'true' && !MOCK) RELEASE_RISKS.push('Payment simulation is enabled.');
}

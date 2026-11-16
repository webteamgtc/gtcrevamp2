import { NextResponse } from 'next/server';
import { gtcPortalApiBase, isMarketingPortalUrl } from '@/lib/gtc/portalApi';

const TIMEOUT_MS = 60_000;

function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
}

/** @returns {Promise<{ data: object, status: number }>} */
export async function gtcPubRequest(path, { headers, body } = {}) {
  const base = gtcPortalApiBase();
  if (isMarketingPortalUrl(base)) {
    return {
      data: {
        code: 500,
        message: 'GTC_PORTAL_API misconfigured',
        detail: 'Must point at web.mygtc.app, not gtcfx.com',
        data: []
      },
      status: 500
    };
  }

  const url = `${base}/${String(path).replace(/^\//, '')}`;

  let response;
  try {
    response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: { Accept: 'application/json, text/plain, */*', ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch (err) {
    console.error('[gtc] fetch failed:', url, err?.name, err?.message);
    return {
      data: {
        code: 502,
        message: 'Failed to reach GTC API',
        detail: err?.message,
        upstream: base,
        data: []
      },
      status: 502
    };
  }

  const text = await response.text();
  try {
    return { data: text ? JSON.parse(text) : {}, status: response.status };
  } catch {
    console.error('[gtc] non-JSON:', url, response.status, text.slice(0, 200));
    return {
      data: {
        code: 502,
        message: 'Invalid GTC API response',
        detail: `HTTP ${response.status}`,
        upstream: base,
        data: []
      },
      status: 502
    };
  }
}

export function gtcRouteError(err) {
  console.error('[gtc] route error:', err?.message || err);
  return NextResponse.json(
    { code: 500, message: 'Failed to reach GTC API', detail: err?.message, data: [] },
    { status: 500 }
  );
}
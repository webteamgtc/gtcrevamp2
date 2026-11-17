import { NextResponse } from 'next/server';
import { gtcPortalApiBase } from '@/lib/gtc/portalApi';
import { gtcUpstreamHeaders } from '../_upstreamHeaders';

export const runtime = 'nodejs';

const gtcRegUrl = () => `${gtcPortalApiBase()}/reg`;

function siteVisitFromRequest(req, body) {
  const fromBody = body?.site_visit && typeof body.site_visit === 'object' ? body.site_visit : {};
  const extra = {};
  for (const key of ['x-r-a', 'x-r-b', 'x-r-c']) {
    const v = fromBody[key] || req.headers.get(key);
    if (v) extra[key] = v;
  }
  return extra;
}

/** Strip proxy-only fields before upstream reg. */
function upstreamBody(body) {
  const { site_visit: _s, client_origin: _c, ...rest } = body ?? {};
  return rest;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const siteVisit = siteVisitFromRequest(req, body);
    const response = await fetch(gtcRegUrl(), {
      method: 'POST',
      headers: gtcUpstreamHeaders(req, siteVisit, { bodyOrigin: body?.client_origin }),
      body: JSON.stringify(upstreamBody(body)),
      signal: AbortSignal.timeout(60_000)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ code: 500, message: 'Failed to reach GTC API', data: [] }, { status: 500 });
  }
}
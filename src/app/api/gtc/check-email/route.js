import { NextResponse } from 'next/server';
import { gtcPortalApiBase } from '@/lib/gtc/portalApi';
import { gtcUpstreamHeaders } from '../_upstreamHeaders';

export const runtime = 'nodejs';

const gtcCheckEmailUrl = () => `${gtcPortalApiBase()}/check_email`;

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const response = await fetch(gtcCheckEmailUrl(), {
      method: 'POST',
      headers: gtcUpstreamHeaders(req, {}, { bodyOrigin: body?.client_origin }),
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(60_000)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ code: 500, message: 'Failed to reach GTC API', data: [] }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { gtcPortalApiBase } from '@/lib/gtc/portalApi';
import { gtcUpstreamHeaders } from '../_upstreamHeaders';

const gtcRsaKeyUrl = () => `${gtcPortalApiBase()}/rsa_key`;

export async function POST(req) {
  try {
    const body = await req.json();
    const response = await fetch(gtcRsaKeyUrl(), {
      method: 'POST',
      headers: gtcUpstreamHeaders(req, {}, { bodyOrigin: body?.client_origin }),
      body: JSON.stringify({
        scene: body?.scene ?? 'site_visit',
        client: body?.client ?? 'pc'
      }),
      signal: AbortSignal.timeout(60_000)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ code: 500, message: 'Failed to reach GTC API', data: null }, { status: 500 });
  }
}
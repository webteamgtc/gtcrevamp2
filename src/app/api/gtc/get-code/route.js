import { NextResponse } from 'next/server';
import { gtcPortalApiBase } from '@/lib/gtc/portalApi';
import { gtcUpstreamHeaders } from '../_upstreamHeaders';

const gtcGetCodeUrl = () => `${gtcPortalApiBase()}/get_code`;

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const type = body?.type != null ? String(body.type) : '0';
    const response = await fetch(gtcGetCodeUrl(), {
      method: 'POST',
      headers: gtcUpstreamHeaders(req, {}, { bodyOrigin: body?.client_origin }),
      body: JSON.stringify({ email, type })
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ code: 500, message: 'Failed to reach GTC API', data: [] }, { status: 500 });
  }
}

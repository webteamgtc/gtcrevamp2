import { NextResponse } from 'next/server';
import { gtcPubRequest, gtcRouteError } from '../_gtcProxy';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const result = await gtcPubRequest('check_email', {
      headers: { 'Content-Type': 'application/json' },
      body: { email }
    });
    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    return gtcRouteError(err);
  }
}
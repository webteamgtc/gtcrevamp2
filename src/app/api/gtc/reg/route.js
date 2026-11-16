import { NextResponse } from 'next/server';
import { gtcPubRequest, gtcRouteError } from '../_gtcProxy';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const result = await gtcPubRequest('reg', {
      headers: { 'Content-Type': 'application/json' },
      body
    });
    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    return gtcRouteError(err);
  }
}
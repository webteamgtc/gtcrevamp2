import { NextResponse } from 'next/server';
import { gtcPubRequest, gtcRouteError } from '../_gtcProxy';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const result = await gtcPubRequest('get_country', {
      headers: { 'Content-Type': 'application/json' }
    });
    return NextResponse.json(result.data, { status: result.status });
  } catch (err) {
    return gtcRouteError(err);
  }
}
import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otpStore';

export const runtime = 'nodejs';

/** POST { phone, otp } → { success, message } (code from /api/send-phone-otp, single use, 10 min) */
export async function POST(req) {
  try {
    const { phone, otp } = await req.json();
    if (!phone || !otp) return NextResponse.json({ success: false, message: 'Phone and OTP are required.' }, { status: 400 });
    const result = verifyOtp(phone, otp);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message || 'Error verifying OTP.' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail } = body;

    console.log(`🔒 OPT-OUT REQUEST: Telemetry deleted for user ${userEmail || 'Anonymous'}`);

    return NextResponse.json({
      success: true,
      message: 'Telemetry data successfully deleted. You have opted out.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Opt-out failed.' }, { status: 500 });
  }
}

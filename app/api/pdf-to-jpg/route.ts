import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    return NextResponse.json({
        error: 'Server-side conversion requires canvas which is not available. Please use the client-side converter instead.'
    }, { status: 400 });
}

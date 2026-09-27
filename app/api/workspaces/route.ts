import { NextResponse } from 'next/server';
import { getAllWorkspaces } from '@/lib/db';

export async function GET() {
  try {
    const workspaces = await getAllWorkspaces();
    return NextResponse.json({ success: true, workspaces });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

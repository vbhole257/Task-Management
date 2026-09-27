import { NextResponse } from 'next/server';
import { resetDailyRoutineTasks } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const workspaceId = body.workspaceId || 'factory';
    const updatedTasks = await resetDailyRoutineTasks(workspaceId);

    return NextResponse.json({
      success: true,
      message: `Daily routine checklist reset for ${workspaceId}`,
      tasks: updatedTasks,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

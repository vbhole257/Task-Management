import { NextResponse } from 'next/server';
import { createNewTask, getAllWorkspaces } from '@/lib/db';
import { classifyCaptureText } from '@/lib/classifier';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawText = body.text || body.title || body.prompt;

    if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text/dictation string is required' },
        { status: 400 }
      );
    }

    // Explicit override if provided, else run auto-classifier
    const classified = classifyCaptureText(rawText);
    const workspaceId = body.workspaceId || classified.workspaceId;
    const priority = body.priority || classified.priority;

    const newTask = await createNewTask({
      title: classified.title,
      description:
        body.description ||
        `Captured instantly on ${new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}`,
      workspaceId,
      status: 'todo',
      priority,
      dueDate: body.dueDate || classified.dueDate,
      jiraKey: body.jiraKey || classified.jiraKey,
      isDailyRecurring: body.isDailyRecurring ?? classified.isDailyRecurring,
      tags: Array.from(new Set([...(body.tags || []), ...classified.tags, 'Instant Capture'])),
    });

    const workspaces = await getAllWorkspaces();
    const matchedWorkspace = workspaces.find((w) => w.id === workspaceId);

    return NextResponse.json({
      success: true,
      message: `Task captured to ${matchedWorkspace?.name || workspaceId}`,
      workspace: matchedWorkspace?.name || workspaceId,
      task: newTask,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

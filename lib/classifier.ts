import { WorkspaceId, TaskPriority } from '@/types';

interface ClassifiedResult {
  title: string;
  workspaceId: WorkspaceId;
  priority: TaskPriority;
  tags: string[];
  dueDate?: string;
  jiraKey?: string;
  isDailyRecurring?: boolean;
}

export function classifyCaptureText(rawText: string): ClassifiedResult {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  let workspaceId: WorkspaceId = 'rambagh'; // default or fallback
  let priority: TaskPriority = 'medium';
  const tags: string[] = [];
  let jiraKey: string | undefined;
  let isDailyRecurring = false;

  // 1. Workspace Detection
  if (
    lower.includes('factory') ||
    lower.includes('boiler') ||
    lower.includes('syrup') ||
    lower.includes('bottling') ||
    lower.includes('beverage') ||
    lower.includes('sanitization') ||
    lower.includes('capping') ||
    lower.includes('batch') ||
    lower.includes('ph level') ||
    lower.includes('tds')
  ) {
    workspaceId = 'factory';
    if (lower.includes('daily') || lower.includes('routine') || lower.includes('morning check')) {
      isDailyRecurring = true;
      tags.push('Daily Routine');
    }
    if (lower.includes('maintenance') || lower.includes('repair') || lower.includes('pump') || lower.includes('motor')) {
      tags.push('Maintenance');
    }
  } else if (
    lower.includes('jira') ||
    lower.includes('sprint') ||
    lower.includes('standup') ||
    lower.includes('pr ') ||
    lower.includes('pull request') ||
    lower.includes('it job') ||
    lower.includes('office job') ||
    /\b[a-z]{2,5}-\d+\b/i.test(lower)
  ) {
    workspaceId = 'it-job';
    const jiraMatch = text.match(/\b([A-Z]{2,6}-\d+)\b/i);
    if (jiraMatch) {
      jiraKey = jiraMatch[1].toUpperCase();
      tags.push('Jira Ticket');
    }
  } else if (
    lower.includes('self') ||
    lower.includes('personal') ||
    lower.includes('startup') ||
    lower.includes('venture') ||
    lower.includes('freelance') ||
    lower.includes('my project') ||
    lower.includes('saas') ||
    lower.includes('domain') ||
    lower.includes('deploy')
  ) {
    workspaceId = 'it-self';
    tags.push('Venture Project');
  } else if (
    lower.includes('rambagh') ||
    lower.includes('3d print') ||
    lower.includes('3d scan') ||
    lower.includes('scanning') ||
    lower.includes('filament') ||
    lower.includes('pla') ||
    lower.includes('petg') ||
    lower.includes('resin') ||
    lower.includes('slicing') ||
    lower.includes('cad') ||
    lower.includes('stl')
  ) {
    workspaceId = 'rambagh';
    if (lower.includes('scan')) tags.push('3D Scan');
    if (lower.includes('print')) tags.push('3D Print');
  }

  // 2. Priority Detection
  if (
    lower.includes('urgent') ||
    lower.includes('asap') ||
    lower.includes('immediately') ||
    lower.includes('emergency') ||
    lower.includes('high priority') ||
    lower.includes('alert')
  ) {
    priority = 'urgent';
  } else if (lower.includes('important') || lower.includes('high')) {
    priority = 'high';
  } else if (lower.includes('low priority') || lower.includes('whenever') || lower.includes('someday')) {
    priority = 'low';
  }

  // 3. Due Date Detection (Today / Tomorrow)
  let dueDate: string | undefined;
  const today = new Date();
  if (lower.includes('today') || lower.includes('tonight')) {
    dueDate = today.toISOString().split('T')[0];
  } else if (lower.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
  }

  return {
    title: text,
    workspaceId,
    priority,
    tags,
    dueDate,
    jiraKey,
    isDailyRecurring,
  };
}

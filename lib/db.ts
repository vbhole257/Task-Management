import { supabase, isSupabaseConfigured } from './supabase';
import * as localStore from './storage';
import { Task, WorkspaceConfig } from '@/types';

// Convert Supabase DB snake_case record to Task TypeScript camelCase
function mapDbRowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    workspaceId: row.workspace_id,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date || undefined,
    dueTime: row.due_time || undefined,
    reminderAt: row.reminder_at || undefined,
    isDailyRecurring: Boolean(row.is_daily_recurring),
    jiraKey: row.jira_key || undefined,
    printDetails: row.print_details || undefined,
    checklist: Array.isArray(row.checklist) ? row.checklist : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || undefined,
  };
}

// Convert Task TypeScript camelCase to Supabase DB snake_case
function mapTaskToDbRow(task: Partial<Task>): any {
  const row: any = {};
  if (task.id !== undefined) row.id = task.id;
  if (task.title !== undefined) row.title = task.title.trim();
  if (task.description !== undefined) row.description = task.description;
  if (task.workspaceId !== undefined) row.workspace_id = task.workspaceId;
  if (task.status !== undefined) row.status = task.status;
  if (task.priority !== undefined) row.priority = task.priority;
  if (task.dueDate !== undefined) row.due_date = task.dueDate || null;
  if (task.dueTime !== undefined) row.due_time = task.dueTime || null;
  if (task.reminderAt !== undefined) row.reminder_at = task.reminderAt || null;
  if (task.isDailyRecurring !== undefined) row.is_daily_recurring = task.isDailyRecurring;
  if (task.jiraKey !== undefined) row.jira_key = task.jiraKey || null;
  if (task.printDetails !== undefined) row.print_details = task.printDetails || null;
  if (task.checklist !== undefined) row.checklist = task.checklist;
  if (task.tags !== undefined) row.tags = task.tags;
  if (task.completedAt !== undefined) row.completed_at = task.completedAt || null;
  row.updated_at = new Date().toISOString();
  return row;
}

export async function getAllWorkspaces(): Promise<WorkspaceConfig[]> {
  if (!isSupabaseConfigured || !supabase) {
    return localStore.getWorkspaces();
  }

  const { data, error } = await supabase.from('workspaces').select('*').order('created_at', { ascending: true });
  if (error || !data || data.length === 0) {
    return localStore.DEFAULT_WORKSPACES;
  }

  return data.map((w: any) => ({
    id: w.id,
    name: w.name,
    shortName: w.short_name,
    description: w.description || '',
    icon: w.icon,
    color: w.color,
    accentColor: `border-${w.id}-500`,
    badgeBg: w.badge_bg,
    defaultStatus: 'todo',
    allowedStatuses: [
      { id: 'todo', label: 'To Do' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'done', label: 'Done' },
    ],
    tags: [],
  }));
}

export async function getAllTasks(filters?: {
  workspaceId?: string | null;
  status?: string | null;
  priority?: string | null;
  search?: string | null;
}): Promise<Task[]> {
  if (!isSupabaseConfigured || !supabase) {
    let tasks = localStore.getTasks();
    if (filters?.workspaceId && filters.workspaceId !== 'all') {
      tasks = tasks.filter((t) => t.workspaceId === filters.workspaceId);
    }
    if (filters?.status && filters.status !== 'all') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
      tasks = tasks.filter((t) => t.priority === filters.priority);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.jiraKey?.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return tasks;
  }

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });

  if (filters?.workspaceId && filters.workspaceId !== 'all') {
    query = query.eq('workspace_id', filters.workspaceId);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    query = query.eq('priority', filters.priority);
  }
  if (filters?.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Supabase query error:', error);
    return [];
  }

  return (data || []).map(mapDbRowToTask);
}

export async function createNewTask(taskData: Partial<Task> & { title: string; workspaceId?: string }): Promise<Task> {
  const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const taskObj: Task = {
    id,
    title: taskData.title.trim(),
    description: taskData.description || '',
    workspaceId: taskData.workspaceId || 'rambagh',
    status: taskData.status || 'todo',
    priority: taskData.priority || 'medium',
    dueDate: taskData.dueDate || undefined,
    dueTime: taskData.dueTime || undefined,
    reminderAt: taskData.reminderAt || undefined,
    isDailyRecurring: taskData.isDailyRecurring || false,
    jiraKey: taskData.jiraKey || undefined,
    printDetails: taskData.printDetails || undefined,
    checklist: taskData.checklist || [],
    tags: taskData.tags || [],
    createdAt: now,
    updatedAt: now,
    completedAt: taskData.status === 'done' ? now : undefined,
  };

  if (!isSupabaseConfigured || !supabase) {
    return localStore.createTask(taskData);
  }

  const row = mapTaskToDbRow(taskObj);
  row.created_at = now;

  const { data, error } = await supabase.from('tasks').insert(row).select().single();
  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(error.message);
  }

  return mapDbRowToTask(data);
}

export async function updateExistingTask(id: string, updates: Partial<Task>): Promise<Task | null> {
  if (!isSupabaseConfigured || !supabase) {
    return localStore.updateTask(id, updates);
  }

  const now = new Date().toISOString();
  let completedAt = updates.completedAt;
  if (updates.status === 'done') {
    completedAt = completedAt || now;
  } else if (updates.status) {
    completedAt = undefined;
  }

  const rowUpdates = mapTaskToDbRow({
    ...updates,
    completedAt,
  });

  const { data, error } = await supabase.from('tasks').update(rowUpdates).eq('id', id).select().single();
  if (error) {
    console.error('Supabase update error:', error);
    return null;
  }

  return mapDbRowToTask(data);
}

export async function deleteExistingTask(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return localStore.deleteTask(id);
  }

  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) {
    console.error('Supabase delete error:', error);
    return false;
  }
  return true;
}

export async function resetDailyRoutineTasks(workspaceId: string = 'factory'): Promise<Task[]> {
  if (!isSupabaseConfigured || !supabase) {
    return localStore.resetDailyChecklist(workspaceId);
  }

  // Fetch daily tasks
  const { data: tasks, error: fetchErr } = await supabase
    .from('tasks')
    .select('*')
    .eq('workspace_id', workspaceId);

  if (fetchErr || !tasks) return [];

  const updatedList: Task[] = [];

  for (const task of tasks) {
    const isDaily = task.is_daily_recurring || (Array.isArray(task.checklist) && task.checklist.some((c: any) => c.isDailyRoutine));
    if (isDaily) {
      const resetChecklist = Array.isArray(task.checklist)
        ? task.checklist.map((item: any) => ({ ...item, completed: false }))
        : [];

      const { data: updated } = await supabase
        .from('tasks')
        .update({
          status: 'todo',
          checklist: resetChecklist,
          completed_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)
        .select()
        .single();

      if (updated) {
        updatedList.push(mapDbRowToTask(updated));
      }
    }
  }

  return updatedList;
}

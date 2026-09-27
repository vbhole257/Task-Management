import fs from 'fs';
import path from 'path';
import { Task, WorkspaceConfig } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const WORKSPACES_FILE = path.join(DATA_DIR, 'workspaces.json');

export const DEFAULT_WORKSPACES: WorkspaceConfig[] = [
  {
    id: 'rambagh',
    name: 'Rambagh Office',
    shortName: '3D & Scanning',
    description: '3D Printing queue, 3D scanning, client prototyping & CAD deliverables',
    icon: 'Box',
    color: '#8B5CF6', // Purple/Violet
    accentColor: 'border-purple-500 text-purple-400 bg-purple-500/10',
    badgeBg: 'bg-purple-950/60 border-purple-800 text-purple-300',
    defaultStatus: 'todo',
    allowedStatuses: [
      { id: 'todo', label: 'In Queue' },
      { id: 'in_progress', label: 'Printing / Scanning' },
      { id: 'review', label: 'Post-Processing' },
      { id: 'done', label: 'Completed / Dispatched' },
    ],
    tags: ['3D Print', '3D Scan', 'CAD Cleanup', 'Client Sample', 'Filament/Resin'],
  },
  {
    id: 'factory',
    name: 'Beverages Factory',
    shortName: 'Factory Ops',
    description: 'Beverage manufacturing routines, boiler/bottling checks, batch QC & maintenance',
    icon: 'Factory',
    color: '#10B981', // Emerald
    accentColor: 'border-emerald-500 text-emerald-400 bg-emerald-500/10',
    badgeBg: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
    defaultStatus: 'todo',
    allowedStatuses: [
      { id: 'todo', label: 'Daily To-Do' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'done', label: 'Done for Today' },
    ],
    tags: ['Daily Routine', 'Quality Check', 'Bottling Line', 'Sugar Syrup', 'Maintenance', 'Dispatch'],
  },
  {
    id: 'it-job',
    name: 'IT Company Job',
    shortName: 'IT Job (Jira)',
    description: 'Corporate sprint work, Jira linked items, daily standup checklist & PRs',
    icon: 'Briefcase',
    color: '#0EA5E9', // Sky Blue
    accentColor: 'border-sky-500 text-sky-400 bg-sky-500/10',
    badgeBg: 'bg-sky-950/60 border-sky-800 text-sky-300',
    defaultStatus: 'todo',
    allowedStatuses: [
      { id: 'todo', label: 'Sprint Backlog' },
      { id: 'in_progress', label: 'Coding / In Dev' },
      { id: 'review', label: 'In Code Review / PR' },
      { id: 'done', label: 'Done & Shipped' },
    ],
    tags: ['Jira Ticket', 'PR Review', 'Standup', 'Bugfix', 'Meeting Item'],
  },
  {
    id: 'it-self',
    name: 'IT Company Self',
    shortName: 'Personal Ventures',
    description: 'Self projects, freelance tech, alerts, personal software & infrastructure',
    icon: 'Rocket',
    color: '#F43F5E', // Rose
    accentColor: 'border-rose-500 text-rose-400 bg-rose-500/10',
    badgeBg: 'bg-rose-950/60 border-rose-800 text-rose-300',
    defaultStatus: 'todo',
    allowedStatuses: [
      { id: 'todo', label: 'Action Items' },
      { id: 'in_progress', label: 'In Progress' },
      { id: 'done', label: 'Done (Archived)' },
    ],
    tags: ['Venture Project', 'Client Deliverable', 'High Alert', 'Server/Infra', 'Brainstorm'],
  },
];

const INITIAL_SAMPLE_TASKS: Task[] = [];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getWorkspaces(): WorkspaceConfig[] {
  ensureDataDir();
  if (!fs.existsSync(WORKSPACES_FILE)) {
    fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(DEFAULT_WORKSPACES, null, 2), 'utf-8');
    return DEFAULT_WORKSPACES;
  }
  try {
    const raw = fs.readFileSync(WORKSPACES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading workspaces file, falling back to defaults:', err);
    return DEFAULT_WORKSPACES;
  }
}

export function saveWorkspaces(workspaces: WorkspaceConfig[]): void {
  ensureDataDir();
  fs.writeFileSync(WORKSPACES_FILE, JSON.stringify(workspaces, null, 2), 'utf-8');
}

export function getTasks(): Task[] {
  ensureDataDir();
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(INITIAL_SAMPLE_TASKS, null, 2), 'utf-8');
    return INITIAL_SAMPLE_TASKS;
  }
  try {
    const raw = fs.readFileSync(TASKS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading tasks file, falling back to defaults:', err);
    return INITIAL_SAMPLE_TASKS;
  }
}

export function saveTasks(tasks: Task[]): void {
  ensureDataDir();
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

export function createTask(taskData: Partial<Task> & { title: string; workspaceId?: string }): Task {
  const tasks = getTasks();
  const now = new Date().toISOString();
  
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
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

  tasks.unshift(newTask);
  saveTasks(tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const current = tasks[index];
  const now = new Date().toISOString();

  let completedAt = current.completedAt;
  if (updates.status === 'done' && current.status !== 'done') {
    completedAt = now;
  } else if (updates.status && updates.status !== 'done') {
    completedAt = undefined;
  }

  const updatedTask: Task = {
    ...current,
    ...updates,
    id: current.id, // prevent ID overwrite
    createdAt: current.createdAt, // keep creation time
    updatedAt: now,
    completedAt,
  };

  tasks[index] = updatedTask;
  saveTasks(tasks);
  return updatedTask;
}

export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  saveTasks(filtered);
  return true;
}

export function resetDailyChecklist(workspaceId: string = 'factory'): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) => {
    if (task.workspaceId === workspaceId && (task.isDailyRecurring || task.checklist.some((c) => c.isDailyRoutine))) {
      const resetChecklist = task.checklist.map((item) => ({
        ...item,
        completed: false,
      }));
      return {
        ...task,
        status: 'todo' as const,
        completedAt: undefined,
        checklist: resetChecklist,
        updatedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  saveTasks(updatedTasks);
  return updatedTasks;
}

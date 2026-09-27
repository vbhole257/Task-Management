export type WorkspaceId = 'rambagh' | 'factory' | 'it-job' | 'it-self' | string;

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'archived';

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  isDailyRoutine?: boolean;
}

export interface PrintDetails {
  material?: string; // PLA, PETG, Resin, ABS, TPU
  estimatedHours?: number;
  scanRequired?: boolean;
  clientName?: string;
  sampleStatus?: 'pending' | 'printing' | 'curing' | 'ready_for_pickup';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  workspaceId: WorkspaceId;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // ISO date string YYYY-MM-DD
  dueTime?: string; // HH:mm
  reminderAt?: string; // ISO datetime
  isDailyRecurring?: boolean; // For Factory routines that repeat daily
  jiraKey?: string; // e.g. PROJ-102 for IT Job
  printDetails?: PrintDetails; // For Rambagh Office 3D Print / Scan
  checklist: ChecklistItem[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface WorkspaceConfig {
  id: WorkspaceId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  accentColor: string;
  badgeBg: string;
  defaultStatus: TaskStatus;
  allowedStatuses: { id: TaskStatus; label: string }[];
  tags: string[];
}

'use client';

import React from 'react';
import { Task, WorkspaceConfig, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { CheckCircle2, Circle, Clock, Layers, Plus } from 'lucide-react';

interface KanbanViewProps {
  tasks: Task[];
  workspaces: WorkspaceConfig[];
  onUpdateTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
  onOpenNewTaskModal: (status?: TaskStatus) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  workspaces,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onOpenNewTaskModal,
}) => {
  const getWorkspaceConfig = (workspaceId: string) => {
    return workspaces.find((w) => w.id === workspaceId);
  };

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string; bg: string }[] = [
    {
      id: 'todo',
      title: 'To-Do / Queue',
      icon: <Circle className="h-4 w-4 text-sky-400" />,
      color: 'border-sky-500/30 text-sky-300',
      bg: 'bg-sky-950/20',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <Clock className="h-4 w-4 text-amber-400" />,
      color: 'border-amber-500/30 text-amber-300',
      bg: 'bg-amber-950/20',
    },
    {
      id: 'done',
      title: 'Done & Completed',
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      color: 'border-emerald-500/30 text-emerald-300',
      bg: 'bg-emerald-950/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => {
          if (col.id === 'in_progress') {
            return t.status === 'in_progress' || t.status === 'review';
          }
          return t.status === col.id;
        });

        return (
          <div
            key={col.id}
            className={`rounded-2xl border ${col.color} ${col.bg} p-4 flex flex-col min-h-[500px] backdrop-blur-sm`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                {col.icon}
                <h2 className="font-bold text-sm tracking-tight text-white">{col.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 font-mono font-bold text-slate-300">
                  {colTasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  onClick={() => onOpenNewTaskModal('todo')}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  title="Add task to column"
                >
                  <Plus className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Column Tasks */}
            <div className="flex-1 space-y-3 overflow-y-auto">
              {colTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800/80 rounded-xl text-xs text-slate-500">
                  <p>No tasks in {col.title.toLowerCase()}</p>
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    workspaceConfig={getWorkspaceConfig(task.workspaceId)}
                    onUpdateTask={onUpdateTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onToggleStatus={onToggleStatus}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

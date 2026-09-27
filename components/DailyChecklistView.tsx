'use client';

import React, { useState } from 'react';
import { Task, WorkspaceConfig } from '@/types';
import { TaskCard } from './TaskCard';
import { RotateCcw, CheckSquare, Plus, CheckCircle, AlertCircle, Factory } from 'lucide-react';

interface DailyChecklistViewProps {
  tasks: Task[];
  workspaceConfig?: WorkspaceConfig;
  onUpdateTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
  onResetDaily: () => void;
  onOpenNewTaskModal: () => void;
}

export const DailyChecklistView: React.FC<DailyChecklistViewProps> = ({
  tasks,
  workspaceConfig,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
  onResetDaily,
  onOpenNewTaskModal,
}) => {
  const [resetting, setResetting] = useState(false);

  const dailyTasks = tasks.filter((t) => t.isDailyRecurring || t.checklist.some((c) => c.isDailyRoutine));
  const otherTasks = tasks.filter((t) => !t.isDailyRecurring && !t.checklist.some((c) => c.isDailyRoutine));

  const allChecklistItems = dailyTasks.flatMap((t) => t.checklist);
  const totalItems = allChecklistItems.length;
  const completedItems = allChecklistItems.filter((i) => i.completed).length;
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleReset = async () => {
    setResetting(true);
    await onResetDaily();
    setTimeout(() => setResetting(false), 600);
  };

  return (
    <div className="space-y-6">
      {/* Factory Routine Hero Card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-950 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Factory className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Factory Daily Operations</h2>
                <p className="text-xs text-emerald-300/80">
                  Daily recurring checklist for hygiene, machinery, syrup & quality control
                </p>
              </div>
            </div>

            {/* Overall Progress */}
            <div className="mt-4 flex items-center gap-4">
              <div className="w-48 bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-300">
                {completedItems} / {totalItems} items ({percentage}%)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 hover:text-emerald-200 text-xs font-semibold transition active:scale-95 shadow-md"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Reset for Tomorrow</span>
            </button>
            <button
              onClick={onOpenNewTaskModal}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Daily Routine Task Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-400" />
          <span>Active Daily Routines</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dailyTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              workspaceConfig={workspaceConfig}
              onUpdateTask={onUpdateTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onToggleStatus={onToggleStatus}
            />
          ))}
        </div>
      </div>

      {/* Ad-hoc Maintenance / Other Factory Tasks */}
      {otherTasks.length > 0 && (
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <span>Ad-hoc Maintenance & Batch Orders</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                workspaceConfig={workspaceConfig}
                onUpdateTask={onUpdateTask}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

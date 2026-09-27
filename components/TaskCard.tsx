'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Edit2,
  Trash2,
  Box,
  Factory,
  Briefcase,
  Rocket,
  CheckSquare,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Task, WorkspaceConfig, TaskStatus } from '@/types';

interface TaskCardProps {
  task: Task;
  workspaceConfig?: WorkspaceConfig;
  onUpdateTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  workspaceConfig,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isDone = task.status === 'done';
  const totalChecklist = task.checklist?.length || 0;
  const completedChecklist = task.checklist?.filter((c) => c.completed).length || 0;
  const progress = totalChecklist > 0 ? (completedChecklist / totalChecklist) * 100 : 0;

  // Toggle single checklist subitem
  const toggleChecklistItem = (checkId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === checkId ? { ...item, completed: !item.completed } : item
    );

    // If all checklist items are completed and status was todo/in_progress, maybe leave or mark completed
    const allDone = updatedChecklist.length > 0 && updatedChecklist.every((i) => i.completed);

    onUpdateTask({
      ...task,
      checklist: updatedChecklist,
      status: allDone && !isDone ? 'done' : task.status,
    });
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'urgent':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
            <AlertTriangle className="h-3 w-3" /> URGENT
          </span>
        );
      case 'high':
        return (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            HIGH
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
            MED
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            LOW
          </span>
        );
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      case 'review':
        return 'Review / QC';
      case 'done':
        return 'Done';
      default:
        return 'To Do';
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        isDone
          ? 'bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-100'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md hover:shadow-xl hover:shadow-indigo-500/5'
      }`}
    >
      <div className="p-4">
        {/* Header Row: Workspace Pill, Priority, Menu */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {workspaceConfig && (
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${workspaceConfig.badgeBg}`}
              >
                {workspaceConfig.shortName}
              </span>
            )}
            {getPriorityBadge(task.priority)}
            {task.jiraKey && (
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-sky-950 border border-sky-700 text-sky-300">
                {task.jiraKey}
              </span>
            )}
            {task.isDailyRecurring && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300">
                Daily Routine
              </span>
            )}
          </div>

          {/* Action Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Task Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-7 z-20 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 text-xs"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onEditTask(task);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Edit2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteTask(task.id);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title and Main Toggle */}
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleStatus(task)}
            className="mt-0.5 text-slate-500 hover:text-emerald-400 active:scale-90 transition shrink-0"
            title={isDone ? 'Mark as Incomplete' : 'Mark as Done'}
          >
            {isDone ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle className="h-5 w-5 text-slate-500 hover:text-slate-300" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onEditTask(task)}
              className={`text-sm sm:text-base font-semibold text-slate-100 cursor-pointer hover:text-indigo-300 transition leading-snug break-words ${
                isDone ? 'line-through text-slate-500' : ''
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p
                className={`text-xs text-slate-400 mt-1 line-clamp-2 ${
                  isDone ? 'text-slate-600' : ''
                }`}
              >
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* 3D Print / Scan Metadata (Rambagh Office specific) */}
        {task.printDetails && (
          <div className="mt-3 p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/40 text-xs text-purple-200 flex flex-wrap items-center gap-3">
            {task.printDetails.material && (
              <span className="flex items-center gap-1 font-medium">
                <Box className="h-3.5 w-3.5 text-purple-400" />
                <span>{task.printDetails.material}</span>
              </span>
            )}
            {task.printDetails.estimatedHours && (
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-purple-400" />
                <span>~{task.printDetails.estimatedHours} hrs</span>
              </span>
            )}
            {task.printDetails.clientName && (
              <span className="text-slate-400">Client: {task.printDetails.clientName}</span>
            )}
          </div>
        )}

        {/* Checklist Progress Bar & Expansion */}
        {totalChecklist > 0 && (
          <div className="mt-3">
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center justify-between text-xs text-slate-400 cursor-pointer hover:text-slate-200 select-none"
            >
              <div className="flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>
                  Checklist ({completedChecklist}/{totalChecklist})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </div>
            </div>

            {/* Expanded Checklist Subitems */}
            {isExpanded && (
              <div className="mt-2.5 space-y-1.5 pl-2 border-l-2 border-slate-800">
                {task.checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer group/item py-1"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {}}
                      className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-0 cursor-pointer"
                    />
                    <span className={item.completed ? 'line-through text-slate-500' : ''}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Due date, Reminder, Status tag */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className="flex items-center gap-1 text-slate-300">
                <Calendar className="h-3 w-3 text-indigo-400" />
                <span>{task.dueDate}</span>
              </span>
            )}
            {task.reminderAt && (
              <span className="flex items-center gap-1 text-rose-400" title="Alert Set">
                <Clock className="h-3 w-3 text-rose-400" />
                <span>Alert</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-0.5 rounded font-medium ${
                isDone
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                  : task.status === 'in_progress'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800/50'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

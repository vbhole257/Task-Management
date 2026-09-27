'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Box,
  Factory,
  Briefcase,
  Rocket,
  CheckSquare,
  AlertTriangle,
  Tag,
  Layers,
} from 'lucide-react';
import { Task, WorkspaceConfig, TaskStatus, TaskPriority, ChecklistItem } from '@/types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  initialWorkspaceId?: string;
  initialStatus?: TaskStatus;
  workspaces: WorkspaceConfig[];
  onSaveTask: (taskData: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  initialWorkspaceId,
  initialStatus,
  workspaces,
  onSaveTask,
  onDeleteTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState<string>('rambagh');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminderAt, setReminderAt] = useState('');
  const [isDailyRecurring, setIsDailyRecurring] = useState(false);
  const [jiraKey, setJiraKey] = useState('');
  
  // 3D Print Details
  const [printMaterial, setPrintMaterial] = useState('');
  const [printHours, setPrintHours] = useState<number | ''>('');
  const [clientName, setClientName] = useState('');
  const [scanRequired, setScanRequired] = useState(false);

  // Checklist
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setWorkspaceId(taskToEdit.workspaceId || 'rambagh');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.dueDate || '');
      setDueTime(taskToEdit.dueTime || '');
      setReminderAt(taskToEdit.reminderAt || '');
      setIsDailyRecurring(taskToEdit.isDailyRecurring || false);
      setJiraKey(taskToEdit.jiraKey || '');
      setPrintMaterial(taskToEdit.printDetails?.material || '');
      setPrintHours(taskToEdit.printDetails?.estimatedHours ?? '');
      setClientName(taskToEdit.printDetails?.clientName || '');
      setScanRequired(taskToEdit.printDetails?.scanRequired || false);
      setChecklist(taskToEdit.checklist || []);
      setTags(taskToEdit.tags || []);
    } else {
      setTitle('');
      setDescription('');
      setWorkspaceId(initialWorkspaceId && initialWorkspaceId !== 'all' ? initialWorkspaceId : 'rambagh');
      setStatus(initialStatus || 'todo');
      setPriority('medium');
      setDueDate('');
      setDueTime('');
      setReminderAt('');
      setIsDailyRecurring(initialWorkspaceId === 'factory');
      setJiraKey('');
      setPrintMaterial('');
      setPrintHours('');
      setClientName('');
      setScanRequired(false);
      setChecklist([]);
      setTags([]);
    }
  }, [taskToEdit, initialWorkspaceId, initialStatus, isOpen]);

  if (!isOpen) return null;

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklist([
      ...checklist,
      {
        id: `check-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        text: newChecklistText.trim(),
        completed: false,
        isDailyRoutine: workspaceId === 'factory',
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
  };

  const handleToggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Partial<Task> = {
      ...(taskToEdit ? { id: taskToEdit.id } : {}),
      title: title.trim(),
      description: description.trim(),
      workspaceId,
      status,
      priority,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      reminderAt: reminderAt || undefined,
      isDailyRecurring,
      jiraKey: jiraKey.trim() ? jiraKey.trim().toUpperCase() : undefined,
      checklist,
      tags,
      printDetails:
        printMaterial || printHours || clientName || scanRequired
          ? {
              material: printMaterial || undefined,
              estimatedHours: typeof printHours === 'number' ? printHours : undefined,
              clientName: clientName || undefined,
              scanRequired,
            }
          : undefined,
    };

    onSaveTask(payload);
    onClose();
  };

  const currentWorkspaceConfig = workspaces.find((w) => w.id === workspaceId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Layers className="h-4 w-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Check syrup mixing ratio in bottling plant"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, instructions, or meeting notes..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
            />
          </div>

          {/* Workspace & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Workspace Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Workspace
              </label>
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="todo">To-Do / Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review / QC</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="urgent">🚨 Urgent</option>
                <option value="high">🔥 High</option>
                <option value="medium">⚡ Medium</option>
                <option value="low">🌱 Low</option>
              </select>
            </div>
          </div>

          {/* Due Date & Alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-rose-400" />
                <span>Alert / Reminder Time</span>
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          {/* Workspace Specific Conditional Sections */}

          {/* Rambagh Office (3D & Scanning) Specific Fields */}
          {workspaceId === 'rambagh' && (
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/50 space-y-3">
              <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <Box className="h-4 w-4 text-purple-400" />
                <span>3D Print & Scanning Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Material Type
                  </label>
                  <input
                    type="text"
                    value={printMaterial}
                    onChange={(e) => setPrintMaterial(e.target.value)}
                    placeholder="PLA / PETG / Resin"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Est. Print Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={printHours}
                    onChange={(e) => setPrintHours(e.target.value ? parseFloat(e.target.value) : '')}
                    placeholder="e.g. 4.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Client or Lab"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="scanReq"
                  checked={scanRequired}
                  onChange={(e) => setScanRequired(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="scanReq" className="text-xs text-purple-200 cursor-pointer">
                  Includes 3D Handheld Scanning & Mesh Alignment
                </label>
              </div>
            </div>
          )}

          {/* IT Job Jira Ticket Key */}
          {workspaceId === 'it-job' && (
            <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-900/50 space-y-2">
              <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-sky-400" />
                <span>Jira Issue Link / Tracking</span>
              </h3>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Jira Ticket Key
                </label>
                <input
                  type="text"
                  value={jiraKey}
                  onChange={(e) => setJiraKey(e.target.value)}
                  placeholder="e.g., PROJ-1024"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-sky-200 placeholder:text-slate-600"
                />
              </div>
            </div>
          )}

          {/* Factory Daily Recurring Toggle */}
          {workspaceId === 'factory' && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-center gap-2">
              <input
                type="checkbox"
                id="dailyRec"
                checked={isDailyRecurring}
                onChange={(e) => setIsDailyRecurring(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="dailyRec" className="text-xs text-emerald-200 cursor-pointer">
                Repeat as Daily Morning Routine (Can be reset with 1-click every morning)
              </label>
            </div>
          )}

          {/* Subtask / Checklist Builder */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
                <span>Sub-tasks & Checklist Items ({checklist.length})</span>
              </span>
            </label>

            <div className="space-y-2 mb-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleToggleChecklistItem(item.id)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={`flex-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                placeholder="Add sub-task or checklist step..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-indigo-400" />
              <span>Tags</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 flex items-center gap-1.5"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(newTagInput);
                  }
                }}
                placeholder="Add a tag..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => handleAddTag(newTagInput)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
            {taskToEdit && onDeleteTask ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(taskToEdit.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                {taskToEdit ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

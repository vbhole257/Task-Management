'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Task,
  WorkspaceConfig,
  WorkspaceId,
  TaskStatus,
  TaskPriority,
} from '@/types';
import { Navbar } from '@/components/Navbar';
import { WorkspaceTabs } from '@/components/WorkspaceTabs';
import { KanbanView } from '@/components/KanbanView';
import { DailyChecklistView } from '@/components/DailyChecklistView';
import { TaskCard } from '@/components/TaskCard';
import { TaskModal } from '@/components/TaskModal';
import { QuickCaptureBar } from '@/components/QuickCaptureBar';
import { SiriGuideModal } from '@/components/SiriGuideModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import {
  Layers,
  Kanban,
  List,
  CheckCircle2,
  Sparkles,
  Filter,
  AlertTriangle,
  Plus,
  ArrowUpDown,
} from 'lucide-react';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'factory_daily'>('kanban');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<TaskStatus | undefined>(undefined);
  const [isSiriGuideOpen, setIsSiriGuideOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch Workspaces
  const fetchWorkspaces = async () => {
    try {
      const res = await fetch('/api/workspaces');
      const data = await res.json();
      if (data.success && data.workspaces) {
        setWorkspaces(data.workspaces);
      }
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    fetchTasks();
  }, []);

  // Set default view mode depending on active workspace
  useEffect(() => {
    if (activeWorkspace === 'factory') {
      setViewMode('factory_daily');
    } else {
      if (viewMode === 'factory_daily') {
        setViewMode('kanban');
      }
    }
  }, [activeWorkspace]);

  // CRUD Operations

  // 1. Create / Update Task
  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      const isEdit = Boolean(taskData.id);
      const res = await fetch('/api/tasks', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (data.success && data.task) {
        if (isEdit) {
          setTasks((prev) => prev.map((t) => (t.id === data.task.id ? data.task : t)));
          showToast(`Task updated`);
        } else {
          setTasks((prev) => [data.task, ...prev]);
          showToast(`Task created in ${data.task.workspaceId}`);
        }
      }
    } catch (err) {
      console.error('Error saving task:', err);
      showToast('Error saving task');
    }
  };

  // 2. Delete Task
  const handleConfirmDelete = async () => {
    if (!deleteTaskId) return;
    try {
      const res = await fetch(`/api/tasks?id=${deleteTaskId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
        showToast('Task deleted');
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      showToast('Error deleting task');
    }
  };

  // 3. Status Toggle
  const handleToggleStatus = async (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    const updated = { ...task, status: nextStatus };
    await handleSaveTask(updated);
  };

  // 4. Reset Factory Daily Checklist
  const handleResetDaily = async () => {
    try {
      const res = await fetch('/api/tasks/reset-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId: 'factory' }),
      });
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
        showToast('Daily factory checklist reset for today!');
      }
    } catch (err) {
      console.error('Error resetting daily:', err);
      showToast('Failed to reset daily checklist');
    }
  };

  // 5. Quick Capture (Bottom Bar or Speech)
  const handleQuickCapture = async (text: string, wsId?: string) => {
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          workspaceId: wsId,
        }),
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => [data.task, ...prev]);
        showToast(`⚡ Captured to ${data.workspace || 'tasks'}!`);
      }
    } catch (err) {
      console.error('Quick capture error:', err);
      showToast('Error capturing task');
    }
  };

  // Task Filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Workspace filter
      if (activeWorkspace !== 'all' && task.workspaceId !== activeWorkspace) {
        return false;
      }

      // Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }

      // Status filter
      if (filterStatus === 'active' && task.status === 'done') {
        return false;
      }
      if (filterStatus === 'done' && task.status !== 'done') {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesJira = task.jiraKey?.toLowerCase().includes(q);
        const matchesTags = task.tags.some((t) => t.toLowerCase().includes(q));
        const matchesPrint = task.printDetails?.clientName?.toLowerCase().includes(q) ||
          task.printDetails?.material?.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesJira && !matchesTags && !matchesPrint) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, activeWorkspace, filterPriority, filterStatus, searchQuery]);

  // Statistics calculation
  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return {
      total: tasks.length,
      urgent: tasks.filter((t) => t.priority === 'urgent' && t.status !== 'done').length,
      today: tasks.filter((t) => t.dueDate === todayStr && t.status !== 'done').length,
      completed: tasks.filter((t) => t.status === 'done').length,
    };
  }, [tasks]);

  // Task count per workspace
  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tasks.length };
    workspaces.forEach((w) => {
      counts[w.id] = tasks.filter((t) => t.workspaceId === w.id).length;
    });
    return counts;
  }, [tasks, workspaces]);

  const activeWorkspaceConfig = workspaces.find((w) => w.id === activeWorkspace);
  const taskToDeleteObj = tasks.find((t) => t.id === deleteTaskId);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white font-medium text-xs shadow-2xl shadow-indigo-500/40 border border-indigo-400 animate-bounce">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeWorkspace={activeWorkspace}
        workspaces={workspaces}
        onSelectWorkspace={setActiveWorkspace}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setModalInitialStatus('todo');
          setIsTaskModalOpen(true);
        }}
        onOpenSiriGuide={() => setIsSiriGuideOpen(true)}
        onRefresh={() => {
          fetchTasks();
          showToast('Refreshed tasks');
        }}
        stats={stats}
      />

      {/* Workspace Tabs */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <WorkspaceTabs
            activeWorkspace={activeWorkspace}
            workspaces={workspaces}
            onSelectWorkspace={setActiveWorkspace}
            taskCounts={taskCounts}
          />
        </div>
      </div>

      {/* Workspace Header & View Controls */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-6">
        {/* Workspace Title & Description */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {activeWorkspace === 'all' ? 'All Workspaces Feed' : activeWorkspaceConfig?.name}
              </h1>
              {activeWorkspaceConfig && (
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${activeWorkspaceConfig.badgeBg}`}>
                  {activeWorkspaceConfig.shortName}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {activeWorkspace === 'all'
                ? 'Central command for Rambagh 3D, Factory, IT Job (Jira) & Personal tasks'
                : activeWorkspaceConfig?.description}
            </p>
          </div>

          {/* View Mode & Filter Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  viewMode === 'list' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                <span>List</span>
              </button>
              {activeWorkspace === 'factory' && (
                <button
                  onClick={() => setViewMode('factory_daily')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === 'factory_daily'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Daily Routine</span>
                </button>
              )}
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🚨 Urgent Only</option>
              <option value="high">🔥 High</option>
              <option value="medium">⚡ Medium</option>
              <option value="low">🌱 Low</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="done">Completed / Done</option>
            </select>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-2">
            <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-800 rounded-3xl p-8 space-y-3">
            <Layers className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No tasks found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? `No tasks match "${searchQuery}". Try clearing search.`
                : 'Create your first task or use voice capture at the bottom.'}
            </p>
            <button
              onClick={() => {
                setTaskToEdit(null);
                setModalInitialStatus('todo');
                setIsTaskModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition inline-flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Create Task</span>
            </button>
          </div>
        ) : viewMode === 'factory_daily' ? (
          <DailyChecklistView
            tasks={filteredTasks}
            workspaceConfig={activeWorkspaceConfig}
            onUpdateTask={handleSaveTask}
            onEditTask={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(id) => setDeleteTaskId(id)}
            onToggleStatus={handleToggleStatus}
            onResetDaily={handleResetDaily}
            onOpenNewTaskModal={() => {
              setTaskToEdit(null);
              setModalInitialStatus('todo');
              setIsTaskModalOpen(true);
            }}
          />
        ) : viewMode === 'kanban' ? (
          <KanbanView
            tasks={filteredTasks}
            workspaces={workspaces}
            onUpdateTask={handleSaveTask}
            onEditTask={(task) => {
              setTaskToEdit(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={(id) => setDeleteTaskId(id)}
            onToggleStatus={handleToggleStatus}
            onOpenNewTaskModal={(status) => {
              setTaskToEdit(null);
              setModalInitialStatus(status || 'todo');
              setIsTaskModalOpen(true);
            }}
          />
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                workspaceConfig={workspaces.find((w) => w.id === task.workspaceId)}
                onUpdateTask={handleSaveTask}
                onEditTask={(t) => {
                  setTaskToEdit(t);
                  setIsTaskModalOpen(true);
                }}
                onDeleteTask={(id) => setDeleteTaskId(id)}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating iPhone Quick Capture Bar */}
      <QuickCaptureBar
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        onQuickCapture={handleQuickCapture}
      />

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
        initialWorkspaceId={activeWorkspace}
        initialStatus={modalInitialStatus}
        workspaces={workspaces}
        onSaveTask={handleSaveTask}
        onDeleteTask={(id) => setDeleteTaskId(id)}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTaskId)}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDelete}
        taskTitle={taskToDeleteObj?.title}
      />

      {/* Siri & iPhone Shortcut Guide Modal */}
      <SiriGuideModal
        isOpen={isSiriGuideOpen}
        onClose={() => setIsSiriGuideOpen(false)}
      />
    </div>
  );
}

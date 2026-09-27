'use client';

import React from 'react';
import {
  Sparkles,
  Plus,
  Mic,
  Smartphone,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
} from 'lucide-react';
import { WorkspaceId, WorkspaceConfig } from '@/types';

interface NavbarProps {
  activeWorkspace: WorkspaceId | 'all';
  workspaces: WorkspaceConfig[];
  onSelectWorkspace: (id: WorkspaceId | 'all') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenSiriGuide: () => void;
  onRefresh: () => void;
  stats: {
    total: number;
    urgent: number;
    today: number;
    completed: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeWorkspace,
  workspaces,
  onSelectWorkspace,
  searchQuery,
  onSearchChange,
  onOpenNewTaskModal,
  onOpenSiriGuide,
  onRefresh,
  stats,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectWorkspace('all')}>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">TaskOS</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Multi-Workspace
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Rambagh • Factory • IT Job • IT Self</p>
            </div>
          </div>

          {/* Mobile Fast Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenSiriGuide}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-indigo-400 active:scale-95 transition"
              title="iOS Siri & Shortcut Setup"
            >
              <Smartphone className="h-4 w-4 text-purple-400" />
            </button>
            <button
              onClick={onOpenNewTaskModal}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 active:scale-95 transition"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, Jira keys, 3D materials, factory tags..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/80 transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300 px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Right Stats & Action Group */}
        <div className="hidden md:flex items-center gap-3">
          {/* Status Badges */}
          <div className="flex items-center gap-2 text-xs bg-slate-900/80 border border-slate-800/80 rounded-xl p-1.5 px-3">
            {stats.urgent > 0 && (
              <span className="flex items-center gap-1 font-semibold text-rose-400" title="Urgent Tasks">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                {stats.urgent}
              </span>
            )}
            {stats.urgent > 0 && <span className="text-slate-700">|</span>}
            <span className="flex items-center gap-1 text-amber-400" title="Due Today">
              <Clock className="h-3.5 w-3.5" />
              {stats.today}
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-emerald-400" title="Completed">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {stats.completed}
            </span>
          </div>

          {/* Siri / iOS Shortcut setup */}
          <button
            onClick={onOpenSiriGuide}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 text-xs font-medium transition shadow-sm"
          >
            <Smartphone className="h-3.5 w-3.5 text-purple-400" />
            <span>iOS Siri Setup</span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Create Task Button */}
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/25 active:scale-95 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};

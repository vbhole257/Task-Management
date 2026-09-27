'use client';

import React from 'react';
import { Box, Factory, Briefcase, Rocket, LayoutGrid, CheckSquare } from 'lucide-react';
import { WorkspaceId, WorkspaceConfig } from '@/types';

interface WorkspaceTabsProps {
  activeWorkspace: WorkspaceId | 'all';
  workspaces: WorkspaceConfig[];
  onSelectWorkspace: (id: WorkspaceId | 'all') => void;
  taskCounts: Record<string, number>;
}

export const WorkspaceTabs: React.FC<WorkspaceTabsProps> = ({
  activeWorkspace,
  workspaces,
  onSelectWorkspace,
  taskCounts,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="h-4 w-4" />;
      case 'Factory':
        return <Factory className="h-4 w-4" />;
      case 'Briefcase':
        return <Briefcase className="h-4 w-4" />;
      case 'Rocket':
        return <Rocket className="h-4 w-4" />;
      default:
        return <CheckSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 sm:px-6">
      <div className="flex items-center gap-2 min-w-max">
        {/* All Workspaces Tab */}
        <button
          onClick={() => onSelectWorkspace('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
            activeWorkspace === 'all'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400/50'
              : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <LayoutGrid className="h-4 w-4" />
          <span>All Spaces</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
              activeWorkspace === 'all' ? 'bg-indigo-900/80 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {taskCounts['all'] || 0}
          </span>
        </button>

        {/* 4 Dedicated Workspace Tabs */}
        {workspaces.map((workspace) => {
          const isActive = activeWorkspace === workspace.id;
          const count = taskCounts[workspace.id] || 0;

          return (
            <button
              key={workspace.id}
              onClick={() => onSelectWorkspace(workspace.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition border ${
                isActive
                  ? `${workspace.badgeBg} ring-1 ring-white/20 shadow-md`
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span className={isActive ? 'text-inherit' : 'text-slate-400'}>
                {getIcon(workspace.icon)}
              </span>
              <span>{workspace.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

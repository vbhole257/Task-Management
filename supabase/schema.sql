-- ==========================================================
-- TaskOS Database Schema for Supabase (PostgreSQL)
-- Copy and paste this into Supabase SQL Editor and click RUN
-- ==========================================================

-- 1. Create Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    badge_bg TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Default 4 Workspaces
INSERT INTO workspaces (id, name, short_name, description, icon, color, badge_bg)
VALUES
    ('rambagh', 'Rambagh Office', '3D & Scanning', '3D Printing queue, 3D scanning, client prototyping & CAD deliverables', 'Box', '#8B5CF6', 'bg-purple-950/60 border-purple-800 text-purple-300'),
    ('factory', 'Beverages Factory', 'Factory Ops', 'Beverage manufacturing routines, boiler/bottling checks, batch QC & maintenance', 'Factory', '#10B981', 'bg-emerald-950/60 border-emerald-800 text-emerald-300'),
    ('it-job', 'IT Company Job', 'IT Job (Jira)', 'Corporate sprint work, Jira linked items, daily standup checklist & PRs', 'Briefcase', '#0EA5E9', 'bg-sky-950/60 border-sky-800 text-sky-300'),
    ('it-self', 'IT Company Self', 'Personal Ventures', 'Self projects, freelance tech, alerts, personal software & infrastructure', 'Rocket', '#F43F5E', 'bg-rose-950/60 border-rose-800 text-rose-300')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done'
    priority TEXT NOT NULL DEFAULT 'medium', -- 'urgent', 'high', 'medium', 'low'
    due_date TEXT,
    due_time TEXT,
    reminder_at TIMESTAMPTZ,
    is_daily_recurring BOOLEAN DEFAULT FALSE,
    jira_key TEXT,
    print_details JSONB, -- { material, estimatedHours, clientName, scanRequired }
    checklist JSONB DEFAULT '[]'::jsonb, -- [ { id, text, completed, isDailyRoutine } ]
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Enable Row Level Security (RLS) & Public access for your personal app
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated and anonymous API key (Personal single-user TaskOS)
CREATE POLICY "Allow all on workspaces" ON workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

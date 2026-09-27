# ADR 0001: Architecture & Technology Stack

## Status
Accepted

## Context
The user manages four distinct operational contexts (Rambagh 3D Office, Beverages Factory, IT Job, IT Self projects).
Primary device: iPhone (iOS).
Key requirements:
1. Instant capture from iPhone when someone verbally asks for something or a task comes up.
2. Low latency and offline-capable mobile interface.
3. Dedicated spaces for each business vertical with Kanban and Checklist views.
4. Alerts / reminders with a clean Done column/view.

## Decision
We will build a **Next.js 14+ PWA (Progressive Web App)** with a **Tailwind CSS + Shadcn UI mobile-first interface**, backed by **SQLite / PostgreSQL with Prisma ORM (or Supabase)** and an open REST/Webhook API for iOS Shortcuts & Siri integration.

### Key Technology Stack:
1. **Frontend**: Next.js (App Router), React, Tailwind CSS, Lucide Icons, Framer Motion (for smooth swipe-to-complete on iOS).
2. **PWA Shell**: `@ducanh2912/next-pwa` or `@serwist/next` with service worker support for offline caching and iOS home-screen app experience.
3. **Backend & API**: Next.js API Routes / Server Actions exposing:
   - `/api/tasks` (CRUD endpoints)
   - `/api/capture` (Fast lightweight endpoint tailored for Siri & iOS Shortcut webhooks)
4. **Database**: SQLite (via Prisma or Drizzle for local/standalone deployment) or PostgreSQL / Supabase.
5. **Notifications / Reminders**: Web Push Notifications (Safari iOS 16.4+ Web Push) + iOS Shortcut reminder hooks.

## Consequences
### Positive:
- **Zero friction installation**: Install directly to iPhone home screen with standalone native app appearance.
- **Fast iOS Shortcuts / Siri integration**: An iOS Shortcut can send voice or typed text directly to `/api/capture` in < 200ms.
- **Desktop & Mobile Sync**: Accessible seamlessly from laptop during IT work and iPhone while at Rambagh or Factory.
- **Full Customizability**: Specific views (Kanban for IT Self, Daily Checklist for Factory, 3D Queue for Rambagh).

### Negative / Mitigations:
- Web Push on iOS requires "Add to Home Screen" (easily guided in first-time user setup modal).

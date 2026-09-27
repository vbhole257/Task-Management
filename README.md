# TaskOS - Multi-Workspace Task Management & iPhone Instant Capture

A high-performance, mobile-first Task OS built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**, engineered for rapid task capture across 4 dedicated workspaces.

---

## 🗂️ 4 Workspaces

1. **🏢 Rambagh Office**:
   - 3D Printing queue & handheld 3D scanning operations.
   - Material specification (PLA, PETG, Resin, ABS), estimated print hours, CAD mesh status, and client tagging.
2. **🏭 Beverages Factory**:
   - Daily morning routine checklist (water RO TDS, syrup mixing tank, bottle capping torque, CIP sanitization).
   - 1-click **"Reset for Tomorrow"** button to reuse the operational checklist every single day.
   - Ad-hoc maintenance logs and batch quality tracking.
3. **💻 IT Company Job**:
   - Jira ticket synchronization (`PROJ-1024`), sprint priorities, meeting action items, and pull request reviews.
4. **🚀 IT Company Self**:
   - Personal venture projects, startup milestones, freelance tasks, urgent alerts, and dedicated Kanban (To-Do $\rightarrow$ In Progress $\rightarrow$ Done).

---

## ⚡ Full CRUD Operations Supported

- **Create (Add)**:
  - From the top `+ Add Task` button with full metadata modal.
  - From the floating bottom **Quick Capture Bar** with speech-to-text dictation.
  - From **"Hey Siri, Add Task"** on your iPhone.
- **Read (View)**:
  - Interactive **Kanban Board** with column counts.
  - **List View** for compact mobile scrolling.
  - Specialized **Daily Routine Checklist View** for factory operations.
  - Live search across task titles, notes, Jira keys, client names, and hashtags.
  - Instant filters by Priority (`🚨 Urgent`, `🔥 High`, `⚡ Medium`, `🌱 Low`) and Status (`Active` vs `Done`).
- **Update (Edit)**:
  - 1-tap complete / uncomplete checkmark.
  - Full edit modal (change title, description, workspace, status, priority, due date, alert time, 3D specs, sub-tasks).
  - Inline sub-task toggle and real-time progress bar.
- **Delete (Remove)**:
  - Delete with safety confirmation dialog.

---

## 📱 iPhone Instant Capture & Siri Setup

1. **Install on iPhone**: Open `http://<your-ip>:3000` in **Safari** $\rightarrow$ Tap **Share** $\rightarrow$ Select **"Add to Home Screen"**.
2. **"Hey Siri" Setup**:
   - Open the **Shortcuts** app on your iPhone.
   - Create shortcut **"Add Task"**:
     - Action 1: **Dictate Text**
     - Action 2: **Get Contents of URL** (`POST` to `http://<YOUR_IP_OR_DOMAIN>:3000/api/capture` with body `{"text": "[Dictated Text]"}`)
     - Action 3: **Show Notification** "Task Logged!"
3. **Use Hands-Free**: Say *"Hey Siri, Add Task: Check beverage bottling line at factory"* $\rightarrow$ Siri will log and auto-route it to the Beverages Factory workspace in under 2 seconds!

---

## 🚀 Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

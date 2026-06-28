# Contest Control Center

A real-time contest administration dashboard for managing competitive programming events. Built with modern web technologies, this project provides live monitoring of submissions, participant rankings, and operational controls.

**Live Demo:** [contest-control-center.vercel.app](https://contest-control-center.vercel.app)

## Features

- **Live Leaderboard** — Real-time standings with acceptance rates and problem-wise performance
- **Submission Feed** — Monitor and rejudge submissions with verdict filtering
- **Participant Management** — Track participant status, ratings, and filter by college/year
- **Problem Health Analytics** — Visualize acceptance rates and submission counts per problem
- **Announcements System** — Broadcast clarifications and alerts with severity levels
- **Contest Controls** — Toggle submissions, freeze scoreboard, pause contest timer
- **Live Data Stream** — Auto-updating submission feed with 2.2s intervals

## Tech Stack

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 8
- **Routing:** TanStack Router v1
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **UI Components:** Radix UI primitives
- **State Management:** React Context + useReducer
- **Icons:** Lucide React
- **Notifications:** Sonner (toast system)
- **Form Handling:** React Hook Form + Zod validation
- **Deployment:** Vercel

## Project Structure

```
src/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout with providers
│   ├── index.tsx     # Dashboard/home page
│   ├── leaderboard.tsx
│   ├── problems.tsx
│   ├── participants.tsx
│   ├── submissions.tsx
│   ├── announcements.tsx
│   └── settings.tsx
├── components/
│   ├── ui/           # Reusable UI components
│   ├── common/       # App-specific components
│   └── layout/       # Layout components (Sidebar, TopBar)
├── lib/
│   ├── contest-store.tsx  # Global state with useReducer
│   ├── mock-data.ts       # Mock data generators
│   └── format.ts          # Formatting utilities
├── main.tsx          # Entry point
└── styles.css        # Tailwind CSS
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Ananya9999999/contest-control-center.git
cd contest-control-center
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:8080`

### Build

```bash
npm run build
npm run preview
```

## Key Implementation Details

### State Management
Uses React Context + useReducer for centralized state management without Redux:
- Contest configuration (timing, freeze state)
- Participants and submissions
- Announcements with pinning
- Real-time submission stream

### Mock Data
Generates realistic contest data:
- 120 participants with varied colleges, years, ratings
- 260+ initial submissions across 7 problems
- Continuous submission stream at 2.2s intervals
- Randomized verdicts (AC, WA, TLE, RE, CE, MLE)

### Real-Time Updates
- Clock ticks every second for contest timer
- Auto-populating submission feed
- Live leaderboard recalculation on each submission
- Acceptance rate calculations per problem

### Performance Optimizations
- Memoized selectors (useLeaderboard, useStats)
- Efficient filtering and sorting
- Lazy component rendering

## Features Showcase

### Dashboard
Real-time overview with contest progress, submission rate, and participant activity.

### Leaderboard
Interactive standings with per-problem attempt/AC tracking. Ranked by score, then problems solved, then last AC time.

### Submissions
Filterable submission log with verdict badges, runtime tracking, and rejudge capability.

### Participants
Search and filter participants by status, college, and year. Toggle disqualification status.

### Announcements
Broadcast system with severity levels (Info/Warning/Critical) and message pinning.

### Settings
Operational controls: toggle submissions, freeze scoreboard, pause contest clock.

## Deployment

Deployed on Vercel with:
- Automatic deployments from GitHub
- Zero-config support for React + Vite
- Environment-based configuration

```bash
vercel --prod
```

## Development Notes

### Component Decisions
- Used TanStack Router for file-based routing (better organization than manual setup)
- Tailwind CSS + shadcn/ui for rapid, consistent UI development
- React Context for lightweight state (sufficient for this scope)

### Trade-offs
- Mock data only (no backend) — perfect for demonstrating UI/UX
- Single-user interface (no auth) — focus on contest visualization
- Local state (no persistence) — resets on page reload

## Future Enhancements

- Backend API integration for real contest data
- WebSocket support for true real-time updates
- User authentication and role-based access
- Export functionality (CSV, PDF)
- Dark mode toggle
- Mobile-optimized views

## Learning Outcomes

This project demonstrates:
- ✅ Modern React patterns (hooks, context, performance)
- ✅ TypeScript in production
- ✅ State management without external libraries
- ✅ Component-driven UI development
- ✅ Responsive design with Tailwind CSS
- ✅ Real-time data visualization
- ✅ Build tool optimization (Vite)
- ✅ Deployment and DevOps (Vercel)

## License

MIT

## Author

Built as a portfolio project showcasing full-stack web development skills.

---

**Questions or feedback?** Open an issue or reach out!

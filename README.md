# 🌌 NOVA Portfolio — Orbital Command Console

> **System Telemetry:** Online | **Database Status:** Operational | **Active Trajectory:** 2025 – Present

Welcome to **NOVA Portfolio**, a high-fidelity cinematic digital twin and command console representing the software engineering universe of **Adit Kapadiya** — an IT student specializing in Artificial Intelligence, Backend Engineering, and Data Science.

Drawing design inspiration from cinematic sci-fi interfaces and space terminal telemetry (the "Orbital Command" paradigm), this application unifies interactive 3D particle fields, responsive data-driven radar visualizers, dynamic tRPC endpoints, and a full database-backed contact terminal into one cohesive web dashboard.

---

## 🧭 The Design Philosophy: "Orbital Command"

The interface is built to evoke the experience of piloting a space mission console or terminal night deck:

- **Void-First Canvas:** Grounded in a deep, atmospheric space black (`oklch(0.13 0.02 245)`) that allows active signals to stand out with crisp visual contrast.
- **Telemetry Color Palette:** Color carries strict functional meaning instead of being purely decorative:
  - **NOVA Cyan (`#00E5FF`):** Live telemetry, system data, navigation paths, and status highlights.
  - **Action Amber (`#F6C453`):** Interactive coordinates, hover triggers, buttons, and user inputs.
  - **Insight Purple (`#C084FC`):** Deep learning, neural networks, and AI components.
  - **Success Mint (`#00FFA3`):** Active status updates, successful database operations, and logs.
- **HUD Craftsmanship:** Features precision monospace displays, coordinates layout (`LAT 12.97° / SYS.NEURON-04`), subtle CRT scanlines, and corner-bracket framing (`⌜ ⌝ ⌞ ⌟`) for terminal panels.
- **Interactive Cursor & Reticle:** A customized hardware cursor locks on to interactive targets, augmenting navigation feedback.

---

## ⚡ Core Architecture & Features

### 1. Console Initialization (Boot Sequence)
On entry, the application executes an interactive system initialization simulation, checking core database routes, loading client modules, and rendering system specifications before launching the main HUD.

### 2. Three.js Particle Command Canvas
The Hero region integrates a WebGL particle network and an interactive wireframe icosahedron "digital twin". The particle field responds directly to pointer coordinates, adding visual depth and fluid movement to the dashboard header.

### 3. Staggered Mission Logs (Projects)
Projects are rendered as an asymmetric staggered flight-path archive connected by a coordinate progress line. Each mission log includes:
- **Interactive Briefing:** Expandable briefing panel displaying architectural details, core tech stack chips, and key achievements.
- **Mission Visuals:** A screenshot carousel showing live user interfaces.
- **Live Demo Stream:** High-performance, sandbox-secured iframe previews allowing visitors to interact with project deployments directly inside the console without leaving the portfolio.

### 4. Progress Radar (Tech Stack HUD)
A custom data visualizer mapping current focus areas (Artificial Intelligence, Backend Engineering, and Data Science) and language proficiencies into a high-tech tracking radar interface.

### 5. Terminal Uplink (Contact & Notifications)
A secure contact console integrated with Zod validation. Sending a message registers the request into a relational database and triggers instant notification dispatches to the portfolio administrator's channel.

### 6. Admin Panel
A protected control panel accessible at `/admin` (backed by JWT-based role authorization) that lets the owner view, filter, read-mark, and prune incoming terminal messages.

---

## 📂 Project Structure

```
Portfolio/
├── client/                 # React 19 Frontend (Vite)
│   ├── src/
│   │   ├── _core/          # Global styles and layout configurations
│   │   ├── components/     # UI elements (AIChatBox, HudNav, ParticleField, BootSequence, etc.)
│   │   │   └── sections/   # Home page blocks (Hero, About, Missions, Stack, Journey, Contact)
│   │   ├── contexts/       # Theme and global state providers
│   │   ├── hooks/          # React hooks (custom cursor, scroll control)
│   │   ├── lib/            # Utilities (data source of truth, tRPC setup)
│   │   ├── pages/          # Home, Admin console, NotFound routes
│   │   ├── App.tsx         # Main wouter routing index
│   │   └── index.css       # Core Tailwind CSS v4 styling rules
│   └── public/             # Static public assets (logos, screenshots, icons)
├── server/                 # Express & tRPC Backend
│   ├── _core/              # Authentication middleware, contexts, and environment settings
│   ├── db.ts               # Drizzle database connection wrapper
│   ├── routers.ts          # tRPC router endpoints (Auth, Admin procedures, Contact submissions)
│   ├── storage.ts          # S3 storage integrations
│   └── index.ts            # Entrypoint starting local/production servers
├── shared/                 # Shared TypeScript models and constants
├── drizzle/                # Database migrations and schema definitions
├── tsconfig.json           # Compiler rules and import alias maps
├── vite.config.ts          # Build bundle orchestration
└── ideas.md                # Orbital Command UX system specifications
```

---

## 🛠️ The Tech Stack

- **Frontend Core:** [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Styles & Layout:** [Tailwind CSS v4](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) (smooth kinetic transitions)
- **3D Graphics:** [Three.js](https://threejs.org/) + custom WebGL particle engine
- **API Protocol:** [tRPC v11](https://trpc.io/) (ensuring full compile-time type safety from server to client)
- **Backend Server:** [Express](https://expressjs.com/) (Node.js runtime)
- **Database Mapping:** [Drizzle ORM](https://orm.drizzle.team/) + [MySQL2](https://github.com/sidorares/node-mysql2)
- **Validation & Auth:** [Zod](https://zod.dev/) + JWT-based cookies and role verification
- **Testing:** [Vitest](https://vitest.dev/) for unit and integration sweeps

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** Ensure `Node.js >= 20` is installed on your system.
- **Database:** Access to a MySQL instance (or SQLite for local mock database fallback if needed).

### Installation
1. Install project dependencies:
   ```bash
   npm install
   ```

2. Configure Environment:
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DATABASE_URL=mysql://user:password@localhost:3306/portfolio_db
   # JWT authentication secret
   JWT_SECRET=your_super_secure_secret_key
   ```

3. Initialize Database Migrations:
   Generate and apply schemas using Drizzle Kit:
   ```bash
   npm run db:push
   ```

### Execution Commands

- **Development Mode:** Starts the backend server and Vite frontend server with hot-reloading:
  ```bash
  npm run dev
  ```
  Visit [http://localhost:3000/](http://localhost:3000/) in your browser.

- **Production Build:** Optimizes client bundles and bundles server files:
  ```bash
  npm run build
  ```

- **Run Production Server:** Starts the production bundle:
  ```bash
  npm run start
  ```

- **Test Suite:** Execute server unit tests using Vitest:
  ```bash
  npm run test
  ```

- **Linter & Formatter:** Format source code using Prettier:
  ```bash
  npm run format
  ```

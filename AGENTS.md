# AGENTS.md — belajar-pintar

## Project structure

All source code lives in `belajar-pintar/`. All commands must be run from that directory.

```
belajar-pintar/
├── db/                    # JSON Server source files
│   ├── dosen.json
│   ├── matakuliah.json
│   └── user.json
├── src/
│   ├── main.jsx           # Entrypoint (routing, providers)
│   ├── App.jsx            # Empty — intentionally unused
│   ├── App.css            # @import "tailwindcss"
│   ├── Pages/Auth/        # Login, Register, reusable UI components
│   ├── Pages/Admin/       # Dashboard, Kelas, Dosen, Matakuliah, layout
│   ├── Pages/Error/       # 404 page
│   ├── Utils/Apis/        # Axios API modules (Dosen, Matakuliah, Auth)
│   ├── Utils/AxiosInstance.jsx
│   ├── Utils/Contexts/    # AuthContext (global state for user, role, permission)
│   └── utils/             # Dummy data + helpers (toast, swal)
├── merge-json.cjs         # Merges db/*.json → db.json (run before json-server)
├── setup_uts.cjs          # One-time file generator (run once then ignore)
├── eslint.config.js       # ESLint flat config
├── vite.config.js         # Vite + React + Tailwind + @ alias
└── package.json
```

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check (flat config) |
| `npm run preview` | Preview production build |
| `npm run serve` | Generate `db.json` + start JSON Server on port 3001 |

**Order:** In separate terminals, run `npm run serve` first, then `npm run dev`.

No tests, no typecheck, no codegen.

## API (JSON Server)

A dummy REST API at `http://localhost:3001`. Data is edited live in `db/*.json`, then regenerated with `node merge-json.cjs` (or `npm run serve`).

| Endpoint | Resource |
|----------|----------|
| `GET/POST /user` | Users for login/register |
| `GET/POST /user?email=...` | Login lookup (frontend validates password) |
| `GET/POST/PUT/DELETE /dosen` | Dosen CRUD |
| `GET/POST/PUT/DELETE /matakuliah` | Matakuliah CRUD |

## Auth

Login state and learning progress are persisted in `localStorage`. No real backend.

User data includes `role` (`admin`/`mahasiswa`) and `permission[]` for RBAC. Global state managed via `AuthContext` (`src/Utils/Contexts/AuthContext.jsx`).

**AuthProvider wraps the entire app in `main.jsx`.** Components access user via `useAuthStateContext()`.

Demo credentials (from `db/user.json`):

| Email | Password | Role | Access |
|-------|----------|------|--------|
| `admin@mail.com` | `admin123` | admin | Full CRUD (dosen, matakuliah) |
| `mahasiswa@mail.com` | `mahasiswa123` | mahasiswa | Dashboard + Kelas only |

Permission strings used for menu/button visibility:
- `*.page` — sidebar menu item
- `*.create` / `*.update` / `*.delete` — CRUD buttons
- `*.read` — data table

Registration creates new entries in `db/user.json` (via JSON Server POST), with role selection.

## Routing

Router is defined in `main.jsx` using `createBrowserRouter`:
- `/` → AuthLayout > Login
- `/register` → AuthLayout > Register
- `/admin` → ProtectedRoute > AdminLayout (redirects to `/admin/dashboard`)
- `/admin/dashboard` → Dashboard
- `/admin/kelas` → Kelas (accordion materials + "Tanya Dosen" modal)
- `/admin/dosen` → Dosen CRUD (table + modal form)
- `/admin/matakuliah` → Matakuliah CRUD (table + modal form)
- `*` → 404

## Style & conventions

- **Tailwind v4** — uses `@import "tailwindcss"` in `App.css`. No `tailwind.config` or `@tailwind` directives.
- **React 19** with automatic JSX runtime — no `import React` needed in components (but `main.jsx` still uses it).
- **No TypeScript** — plain JSX.
- Components use one-letter variable names for variant/size maps (e.g. `v`, `s`, `b`). Follow existing style.
- Import path inconsistency: both `utils/` and `Utils/` are used (both resolve on case-insensitive filesystems).

## Gotchas

- `App.jsx` is intentionally an empty component (`const App = () => null`). Do not add code there — routing is in `main.jsx`.
- `setup_uts.cjs` was used to generate initial source files. It is not part of the build pipeline. Run it only if files need to be recreated from scratch.
- Root `package-lock.json` is an empty placeholder. The real dependency tree is in `belajar-pintar/package-lock.json`.

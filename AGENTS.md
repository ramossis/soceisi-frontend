# AGENTS.md

## Project

Single-page Vue 3 app (Vite, JavaScript, Vuetify 4, Pinia, vue-router 5) for SOCIE-ISII 2026
pre-registration, event management and attendance. Single package, not a monorepo.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — production build into `dist/`
- `npm run preview` — serve the built app
- `npm run format` — Prettier on `src/` only (uses `--experimental-cli`)
- No test runner, linter, or typechecker is configured; `npm run build` is the only verification step.

Node requirement: `^20.19.0 || >=22.12.0`. Prettier: no semicolons, single quotes, 100 columns.

## Layout

- `src/main.js` — bootstrap: Pinia, router, Vuetify theme `soceisiTheme`, toasts.
- `src/router/index.js` — `/` public form, `/login`, `/asistencia/:eventoId` public attendance,
  `/admin` (guarded) with `AdminDashboard` (aspirantes) and `/admin/eventos` (eventos + QR).
- `src/layouts/AdminLayout.vue` — admin shell with nav + `<router-view>`.
- `src/views/AdminDashboard.vue` — student table; polls `GET /estudiante` every 3s.
- `src/views/EventosView.vue` — event CRUD, QR generation, copy/download link.
- `src/views/AsistenciaView.vue` — public CI check-in page opened from the QR.
- `src/stores/` — `auth.store.js`, `estudiante.store.js`, `evento.store.js`, `asistencia.store.js`.
- `src/config/api/sociApi.js` — single Axios instance; adds `Bearer` token.
- `src/utils/` — jsPDF generators (`reportfactura.js`, `fichaIncripcion.js`).

## API

- API base URL defaults to the deployed Vercel backend. Override with `VITE_API_URL`
  (for local backend: `VITE_API_URL=http://localhost:3600/api`; see `.env.example`).
- Local backend is the sibling `../backend` (Express, `npm run dev`). Its port comes from
  `../backend/.env` (currently 3600; the code default without `.env` is 3000).
- Backend routes: `/api/login`, `/api/estudiante`, `/api/evento`, `/api/asistencia`.
- `GET /api/evento` returns `{ total, data }`; `POST/PUT` require the full
  `{ nombre, tipo, fecha }` body. Event types: `Curso`, `Taller`, `Charla`, `Asamblea`.
- `POST /api/asistencia` is public and expects `{ eventoId, ci }`.
- Keep field names exactly as-is (`cuidad`, `direcion`, `matricula_univ`, etc.). Several are
  intentional misspellings that admin/PDF code depends on.
- Remaining backend work is tracked in `TODO.md`. The attendance controller now uses
  `id_evento`, awaits the event and returns 409 on duplicates; event/student deletes also
  clean up their attendances.
- There is still no public `GET /api/evento/:id` and no attendance-list endpoint; the QR
  carries `nombre`/`tipo` as query params for display.

## Conventions and gotchas

- Use the `@/` alias configured in both `vite.config.js` and `jsconfig.json`; some existing files
  still use relative imports.
- Pinia action/flag names are misspelled: `subimtFormMiembro`, `inscribitMiembro`,
  `isAuhenticated`. Match existing names rather than renaming casually.
- Auth token is in `localStorage.tokenUser`; the router guard checks it directly. User name/role
  is persisted separately in `localStorage.userData` so the admin header survives reloads.
- The Axios interceptor treats both 401 and 403 as session expiry. The backend now returns 401
  for expired JWTs, but 403 is still used when a role is not allowed.
- Vuetify file inputs yield `File | File[]`; `estudiante.store.js` normalizes this before building
  `FormData`.
- UnoCSS packages are installed but not wired (no Vite plugin or `uno.css` import), and
  `src/assets/main.css` is never imported. Use Vuetify utility classes.
- QR codes are generated locally with `qrcode`; do not call external QR services.
- PDF logos are fetched from `public/` paths (`/Logo-SoCiE-ISII.png`, `/dicyt.png`).
- `public/_redirects` supplies the SPA fallback for static hosting (Netlify-style).
- Template leftovers: `src/stores/counter.js` and empty `src/components/admin/ModalDetalle.vue`
  are unused.

# Ahmed Portfolio - Architecture and Implementation Plan

## Scope

Build a MEAN portfolio with separate Angular and Express applications. Portfolio
content is stored in MongoDB and loaded through the REST API; Angular must not
hardcode portfolio content. Do not invent employment, certification, achievement,
or project details. Use clearly marked placeholders until Ahmed supplies them.

## Decisions and constraints

- Keep the applications separate, with independent `package.json` files.
- Use Angular standalone components and routing, with no NgModules.
- Use Node.js CommonJS (`require` and `module.exports`).
- Preserve the versions currently specified by the workspace unless explicitly
  approved otherwise: Express `^5.3.0` and Mongoose `^9.12.3`. These differ from
  the versions mentioned in the supplied brief; the referenced source files are
  not present in the workspace.
- Use feature-oriented backend modules, each containing its model, controller,
  routes, and request validation.
- Do not use Mongoose `populate`, hooks, aggregation, subdocuments, custom
  Mongoose validators, pagination, or the prohibited query operators.
- Keep upload files under `backend/uploads/`; use Multer disk storage and serve
  the directory through Express static middleware.
- Configure secrets and environment-specific values outside source code.
- Use Angular services with `@Injectable({ providedIn: 'root' })` and
  constructor injection; this is the conventional service pattern and is
  compatible with the supplied Angular requirements.
- Use the native Angular form approaches specified per feature: template-driven
  forms where appropriate and reactive forms for validated forms. Custom
  `ValidatorFn`s may be used for non-credential validation when needed.

### Decisions and confirmations

- Do not add application-managed login, credential fields, or credential
  validators. Admin access is local-only and uses no sign-in.
- Enable local admin only with `LOCAL_ADMIN_ENABLED=true` outside production.
  Bind the backend to `127.0.0.1`, restrict admin requests to the configured
  localhost frontend origin, and keep admin writes disabled on public hosts.
- For local admin, set `LOCAL_ADMIN_ENABLED=true` in `backend/.env`, run the
  backend and frontend on localhost, and open `/admin/dashboard`. The backend
  refuses this mode when `NODE_ENV=production`.
- Validation may use `400` in addition to `200`, `201`, `404`, and `500`.
  Local-origin checks may return `403`; do not treat these checks as user
  authentication.
- Approved upload types: JPEG/PNG/WebP images and PDF CVs. The supplied size
  value `1024*1024*2` is confirmed as 2 MiB per file.
- Compatible versions may be selected for explicitly named dependencies that
  are absent from the workspace. Backend versions are pinned to Express
  `5.3.0`, Mongoose `9.12.3`, CORS `2.8.6`, Multer `2.5.0`, and nodemon `3.1.14`.
  Do not add unnamed packages or choose frontend versions before their phase.

## Proposed project structure

```text
ahmed-portfolio/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   ├── services/
│   │   │   │   ├── validators/
│   │   │   │   └── directives/
│   │   │   ├── shared/
│   │   │   ├── features/
│   │   │   │   ├── home/
│   │   │   │   ├── about/
│   │   │   │   ├── skills/
│   │   │   │   ├── projects/
│   │   │   │   ├── project-details/
│   │   │   │   ├── experience/
│   │   │   │   ├── contact/
│   │   │   │   ├── admin/
│   │   │   │   └── not-found/
│   │   ├── assets/
│   │   └── styles.css
│   └── package.json
├── backend/
│   ├── config/
│   ├── middleware/

│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── api.md
│   └── architecture.md
├── .gitignore
└── README.md
```

The public Angular router will use shared layouts and child routes for public and
admin areas. The admin route tree will include dashboard, profile, projects,
skills, experience, education, certifications, messages, and settings. Expose
admin routes only in Angular development mode; the backend's loopback binding and
origin checks are the local-only boundary, not authentication.

## Proposed database collections

Use Mongoose schemas with timestamps and the requested built-in field options
(`required`, `enum`, `default`, ranges, lengths, trimming, case normalization,
and `match`) where appropriate. Use primitive fields and primitive arrays only;
do not use nested subdocuments. Add references only where they are needed, and
do not rely on `populate`.

| Collection | Proposed fields |
|---|---|
| `profiles` | name, title, summary, education, goals, email, GitHub, LinkedIn, profile image path, CV path |
| `projects` | title, slug, summary, overview, problem, solution, features, technologies, screenshots, category, featured flag, repository URL, demo URL |
| `skills` | name, category, proficiency, featured flag |
| `experiences` | organization, title, description, start date, end date, current flag |
| `education` | institution, degree, field, description, start date, end date |
| `certifications` | name, issuer, description, issue date, credential URL |
| `messages` | sender name, email, subject, message, read flag |
| `settings` | unique key, value |

Use unique constraints for identifiers such as project slug and settings key.
Any initial personal profile values should be limited to the
information Ahmed supplied; all other content remains explicitly placeholder
content until provided.

## Proposed API

Prefix all API routes with `/api/v1`. Keep public reads and contact submission
separate from local-only admin operations. Controllers should report errors
explicitly with the approved status codes; validate request fields before
persistence.

| Area | Routes |
|---|---|
| Public profile | `GET /profile` |
| Public skills | `GET /skills` |
| Public projects | `GET /projects`, `GET /projects/:id` |
| Public experience/education/certifications | `GET /experiences`, `GET /education`, `GET /certifications` |
| Contact | `POST /messages` |
| Admin dashboard | `GET /admin/dashboard` |
| Admin profile | `GET /admin/profile`, `PUT /admin/profile` |
| Admin CRUD | `GET` and `POST` on `/admin/projects`, `/admin/skills`, `/admin/experiences`, `/admin/education`, `/admin/certifications`; `PUT` and `DELETE` on each `/:id` |
| Admin messages | `GET /admin/messages`, `PUT /admin/messages/:id`, `DELETE /admin/messages/:id` |
| Admin settings | `GET`, `POST /admin/settings`; `PUT`, `DELETE /admin/settings/:id` |
| Uploads | Profile image and CV upload endpoints under `/admin/profile`; serve stored files from `/uploads` |

Do not add query-based search, filtering, or pagination. Project search and
category/technology filters can be applied to the fetched portfolio data in the
frontend, subject to acceptable collection size.

## Frontend plan

- Provide the HTTP client at application bootstrap with `provideHttpClient`.
- Create typed models and reusable HttpClient services for API resources.
- Configure standalone routes, child routes, redirects with `pathMatch: 'full'`,
  shared layouts, and a not-found route.
- Build public pages with loading, error, and empty states. Obtain all portfolio
  content from backend services.
- Use template-driven forms for simple contact input where suitable and reactive
  forms where validation requires them.
- Add reusable UI components using inputs/outputs and `EventEmitter`; use a
  `BehaviorSubject` only where multiple components need shared live state.
- Apply the supplied palette and font choices, Bootstrap 5.3, responsive layouts,
  accessible controls, and restrained transitions.
- Keep the personal profile editable through the admin interface.

## Backend plan

- Load configuration from environment variables; never expose backend secrets to
  Angular.
- Configure Express JSON parsing, CORS, MongoDB connection, `/api/v1` routing,
  static `/uploads` serving, and a not-found response. Use port `3001` by
  default because the existing root server already uses `3000`.
- Implement feature modules with model, controller, routes, and request
  validation.
- Use explicit `try/catch` handling in controllers and send errors with
  `res.status(...)`; do not introduce a separate Express error-handling
  middleware.
- Implement Multer `diskStorage` with generated filenames and approved file
  restrictions. Create and retain the uploads directory.
- Enable local admin operations only outside production and bind that server to
  `127.0.0.1`; public deployments must leave `LOCAL_ADMIN_ENABLED` unset or false.
- For dashboard counts, avoid aggregation; use the allowed query approach and
  verify the cost remains appropriate for the expected portfolio scale.

## Implementation checklist

### Phase 2 - Planning

- [x] Inspect the existing workspace, package manifests, code, and installed tools.
- [x] Propose separated frontend/backend architecture.
- [x] Draft collection and REST API designs.
- [x] Record version and security decisions requiring confirmation.
- [x] Record the no-login, local-only admin decision and its deployment boundary.
- [x] Confirm validation and authorization response codes.
- [x] Confirm image and CV file types.
- [x] Confirm upload size interpretation and select versions for the explicitly
      named backend dependencies.

### Phase 3 - Backend

- [x] Create backend package and server/app bootstrap.
- [x] Configure environment loading, CORS, MongoDB connection, and static uploads.
- [x] Implement public-content schemas and public feature routes.
- [x] Add contact-message request validation.
- [x] Exercise public endpoints and contact-message success/validation cases.
- [ ] Select an authentication approach before enabling admin writes on a public
      deployment; local-only mode is not production authentication.

### Phase 4 - Frontend

- [x] Initialize Angular and install only approved listed dependencies.
- [x] Implement design system, standalone layouts, and routes.
- [x] Implement public pages and API-driven content states.
- [x] Connect forms and resource services to backend APIs.
- [x] Verify responsive and accessible behavior.

The initial profile and skill entries use only information Ahmed provided and
are stored in MongoDB. No project, employment, certification, or achievement
details have been invented; those sections show empty states until data is
provided.

### Phase 5 - Admin dashboard

- [x] Add a local-development-only admin route tree and dashboard.
- [x] Implement profile, project, skill, experience, education, and certification CRUD.
- [x] Implement message management, settings, and CV/image uploads.
- [x] Restrict admin API requests to local development and disable them in production.
- [x] Verify local CRUD, upload restrictions, and loopback-only backend binding.

The local admin deliberately has no sign-in. Do not expose it on a public host;
select and implement production authentication before enabling admin writes in a
deployment.

### Phase 6 - Testing

- [x] Test API success, validation, local-origin restrictions, production disablement, and not-found cases.
- [x] Test CRUD and file upload restrictions.
- [x] Test forms, development-only routing, and API error/loading/empty states.
- [x] Verify responsive layouts and fix regressions.

Verification results: backend tests passed (12/12), frontend tests passed (9/9),
and the production build passed with a 425.42 kB initial bundle. Live checks
covered all public and admin routes, API CRUD and contact submission, invalid
requests, upload-type rejection, and the admin route in a production build.
Mobile checks at 320 and 375 px found and fixed horizontal overflow in
the admin navigation and contact layout; tested routes then fit without
horizontal page overflow. Temporary database records and test uploads were
removed.

### Phase 7 - Documentation

- [x] Add root README with project layout, prerequisites, local setup, and commands.
- [x] Document environment variables and local-only admin behavior.
- [x] Document implemented API endpoints, request fields, statuses, and uploads.
- [x] Add deployment guidance, including current API URL and authentication blockers.

## Suggested phase gates

Phase 3 backend, Phase 4 public frontend, local Phase 5 admin, and Phase 6
verification are complete, and Phase 7 documentation is complete. Public
deployment still requires changing the frontend's hard-coded local API URL.
Public admin writes remain disabled until a production authentication approach
is selected and implemented.

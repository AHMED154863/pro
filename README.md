# Ahmed Zakaria Rashad - Portfolio

A MEAN-stack personal portfolio with separate Angular and Express applications.
Public portfolio content is read from MongoDB through the REST API. Do not add
work experience, certifications, achievements, or project details without
Ahmed's input.

## Project layout

```text
frontend/       Angular standalone application
backend/        Express REST API, Mongoose models, and uploads/
docs/
  api.md        Implemented API reference
  architecture.md
```

The root `project.js` is an empty placeholder retained from the existing
workspace; it is not part of either application. Install and run the frontend
and backend from their own directories.

## Requirements

- Node.js supported by the installed Angular CLI. This workspace was verified
  with Node.js 26.13.1 and npm 11.20.0.
- A MongoDB instance reachable by the backend.
- npm.

The Angular CLI package requires Node.js `^22.22.3`, `^24.15.0`, or `>=26.0.0`.
Frontend and backend dependencies are managed independently with their own
`package-lock.json` files.

## Local setup

Start MongoDB first. The example connection string uses a local MongoDB instance
and database named `ahmed_portfolio`.

### Backend

In a terminal:

```powershell
Set-Location backend
npm ci
Copy-Item .env.example .env
npm run dev
```

The API listens on `http://localhost:3001` by default. `backend/.env.example`
enables the no-login local admin for development. Keep that setting local only;
see [Deployment](#deployment).

### Frontend

In a second terminal:

```powershell
Set-Location frontend
npm ci
npm start
```

Open `http://localhost:4200`. To use the local admin, open
`http://localhost:4200/admin/dashboard`. The admin interface and write endpoints
are for local development only and have no login; the backend requires a
localhost client, the configured frontend origin, and explicit local enablement.
Do not expose them on a public host.

If PowerShell blocks the `npm` script due to its execution policy, invoke the
Windows command shim as `npm.cmd` instead.

## Environment variables

Copy `backend/.env.example` to `backend/.env` for local development. The `.env`
file is ignored by Git; do not commit it or put backend secrets in Angular.

| Variable              | Purpose                                                     | Default                       |
| --------------------- | ----------------------------------------------------------- | ----------------------------- |
| `MONGODB_URI`         | MongoDB connection string; required                         | None                          |
| `PORT`                | Backend listen port                                         | `3001`                        |
| `FRONTEND_ORIGIN`     | Exact browser origin allowed by CORS and local-admin checks | `http://localhost:4200`       |
| `LOCAL_ADMIN_ENABLED` | Enables unauthenticated local admin routes                  | Disabled unless set to `true` |
| `NODE_ENV`            | Runtime mode; `production` prevents local-admin startup     | Unset                         |

When local admin is enabled, the server binds to `127.0.0.1` and validates the
request origin and client address. `LOCAL_ADMIN_ENABLED=true` with
`NODE_ENV=production` prevents the backend from starting.

## Checks and production build

Run each command from the relevant application directory:

```powershell
# backend
Set-Location backend
npm test

# frontend
Set-Location ..\frontend
npm test -- --watch=false
npm run build
```

The Angular production output is written to `frontend/dist/frontend/browser/`.

## API reference

See [docs/api.md](./docs/api.md) for the implemented routes, request fields,
response codes, upload constraints, and local-admin boundary. The local API base
URL is `http://localhost:3001/api/v1`.

## Deployment

**This workspace is not ready to deploy as a complete public application without
deployment-specific configuration.**

1. The frontend currently uses the literal API URL
   `http://localhost:3001/api/v1` in
   `frontend/src/app/core/services/portfolio-api.service.ts`. Set it to the
   deployed HTTPS API origin and rebuild the frontend before hosting it.
2. Install backend production dependencies with `npm ci --omit=dev` and start it
   with `npm start`. Set `MONGODB_URI` as a backend-only secret, `PORT` as required by the host,
   `FRONTEND_ORIGIN` to the exact public frontend origin, and `NODE_ENV=production`.
   Set `LOCAL_ADMIN_ENABLED=false` (or leave it unset). Never deploy the
   `.env.example` local-admin setting.
3. Keep the API's CORS origin aligned with the deployed frontend. Use HTTPS for
   public traffic and restrict database access to the backend.
4. Provide durable writable storage for `backend/uploads/`; uploaded profile
   images and CVs are stored on disk and their paths are kept in MongoDB.
5. Do not enable public admin writes until a production identity provider and
   server-side authorization have been selected and implemented. The current
   admin has no login; Angular development routing and local backend checks are
   not production authentication.
6. After configuring the frontend API URL, run `npm ci` and `npm run build` in
   `frontend/`, then publish `frontend/dist/frontend/browser/` using a static
   host configured to serve the Angular app's entry page for client-side routes.
   Do not publish `backend/.env` or private connection strings in frontend
   assets.

See [docs/architecture.md](./docs/architecture.md) for the architectural
decisions and phase status.

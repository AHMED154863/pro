# Portfolio REST API

## Base URL and responses

The local API base is `http://localhost:3001/api/v1`. All data routes return
JSON, generally in the form:

```json
{
  "success": true,
  "data": {}
}
```

Errors use `success: false` and a `message`. Successful reads and updates return
`200`; resource creation returns `201`. Invalid input, Mongoose validation
failures, duplicate unique values, or an invalid MongoDB ID return `400`; missing
records/routes return `404`, local-admin boundary failures return `403`, and
unexpected server-side failures return `500`.

There is no API pagination or query-based search/filtering. Project search and
filters are applied by the frontend to the fetched projects.

## Public endpoints

| Method | Path                 | Purpose                      |
| ------ | -------------------- | ---------------------------- |
| `GET`  | `/profile`           | Read the portfolio profile   |
| `GET`  | `/projects`          | List projects                |
| `GET`  | `/projects/:id`      | Read a project by MongoDB ID |
| `GET`  | `/skills`            | List skills                  |
| `GET`  | `/experiences`       | List experience records      |
| `GET`  | `/education`         | List education records       |
| `GET`  | `/certifications`    | List certifications          |
| `POST` | `/messages`          | Submit a contact message     |
| `GET`  | `/uploads/:filename` | Retrieve an uploaded file    |

`POST /messages` requires a JSON object with non-empty string fields `name`,
`email`, `subject`, and `message`. The email must be valid. A successful request
returns `201` and the created message.

Example request body:

```json
{
  "name": "Your name",
  "email": "you@example.com",
  "subject": "A message subject",
  "message": "Your message"
}
```

An invalid project ID returns `400`; a valid ID with no matching project
returns `404`. A missing profile also returns `404`.

## Local-admin endpoints

These endpoints are **unauthenticated and local-development only**. Requests
must come from a loopback client, use the configured local frontend host, and
include the exact configured `FRONTEND_ORIGIN`. Enable them only with
`LOCAL_ADMIN_ENABLED=true` outside production. Otherwise they are unavailable;
the backend refuses to start in production if local admin is enabled.

`GET /admin/dashboard` returns project, skill, total-message, and unread-message
counts plus recent activities.

| Methods         | Path                        | Purpose                           |
| --------------- | --------------------------- | --------------------------------- |
| `GET`, `PUT`    | `/admin/profile`            | Read/update profile fields        |
| `POST`          | `/admin/profile/image`      | Upload a profile image            |
| `POST`          | `/admin/profile/cv`         | Upload a CV                       |
| `GET`, `POST`   | `/admin/projects`           | List/create projects              |
| `PUT`, `DELETE` | `/admin/projects/:id`       | Update/delete a project           |
| `GET`, `POST`   | `/admin/skills`             | List/create skills                |
| `PUT`, `DELETE` | `/admin/skills/:id`         | Update/delete a skill             |
| `GET`, `POST`   | `/admin/experiences`        | List/create experience records    |
| `PUT`, `DELETE` | `/admin/experiences/:id`    | Update/delete an experience       |
| `GET`, `POST`   | `/admin/education`          | List/create education records     |
| `PUT`, `DELETE` | `/admin/education/:id`      | Update/delete an education record |
| `GET`, `POST`   | `/admin/certifications`     | List/create certifications        |
| `PUT`, `DELETE` | `/admin/certifications/:id` | Update/delete a certification     |
| `GET`           | `/admin/messages`           | List contact messages             |
| `PUT`, `DELETE` | `/admin/messages/:id`       | Set read state/delete a message   |
| `GET`, `POST`   | `/admin/settings`           | List/create settings              |
| `PUT`, `DELETE` | `/admin/settings/:id`       | Update/delete a setting           |

The profile update accepts a non-empty JSON object containing one or more of
`name`, `professionalTitle`,
`professionalSummary`, `education`, `careerJourney`, `professionalGoals`,
`email`, `linkedInUrl`, and `githubUsername`.

Resource create/update JSON bodies accept only the fields listed here; IDs and
timestamps are managed by the API:

| Resource       | Accepted fields                                                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Projects       | `title`, `slug`, `summary`, `overview`, `problem`, `solution`, `features`, `technologies`, `screenshots`, `category`, `featured`, `githubUrl`, `liveDemoUrl` |
| Skills         | `name`, `category`, `proficiency`, `featured`                                                                                                                |
| Experiences    | `organization`, `title`, `description`, `startDate`, `endDate`, `isCurrent`                                                                                  |
| Education      | `institution`, `degree`, `fieldOfStudy`, `description`, `startDate`, `endDate`                                                                               |
| Certifications | `name`, `issuer`, `description`, `issuedAt`, `credentialUrl`                                                                                                 |
| Settings       | `key`, `value`                                                                                                                                               |
| Messages       | `isRead` for updates                                                                                                                                         |

Profile and resource validation is enforced by the server before persistence.
The `PUT /admin/messages/:id` body must contain a boolean `isRead`.

### Uploads

Send `multipart/form-data` to the corresponding upload endpoint with a single
file field:

| Endpoint                    | Form field | Accepted MIME types | Maximum size |
| --------------------------- | ---------- | ------------------- | ------------ |
| `POST /admin/profile/image` | `image`    | JPEG, PNG, WebP     | 2 MiB        |
| `POST /admin/profile/cv`    | `cv`       | PDF                 | 2 MiB        |

Files are stored in `backend/uploads/` under generated names. Their public paths
are served from `/uploads/`; the profile record stores the image and CV paths.

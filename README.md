# Task Manager API

Node.js 20+, Express, TypeScript, MongoDB/Mongoose, Cognito JWT verification.

## Local setup (PowerShell)

```powershell
node --version
npm --version
Copy-Item .env.example .env
# Edit .env with your MongoDB Atlas URI before starting the server.
npm install
npm run typecheck
npm test
npm run build
npm run dev
```

API base path: `http://localhost:4000/api/v1`

- `GET /health/live` — process liveness; no database required.
- `GET /health/ready` — readiness; returns 200 only when MongoDB is connected.
- `GET /api/v1` — API metadata.
- `POST /api/v1/tasks` — create an authenticated user's task.
- `GET /api/v1/tasks` — list the authenticated user's tasks (supports `page`, `limit`, `status`, and `priority`).
- `GET /api/v1/tasks/:id` — get one owned task.
- `PATCH /api/v1/tasks/:id` — update an owned task.
- `DELETE /api/v1/tasks/:id` — delete an owned task (204 response).

All task routes require `Authorization: Bearer <Cognito access token>`. Task ownership is assigned by the API from the verified token's `sub` claim; clients cannot choose `ownerId`. The API scopes reads, updates, and deletes by both task ID and owner ID.

The app validates environment variables on server startup. The HTTP app can be imported by tests without loading `.env`.

## MongoDB Atlas

1. Create a database user with a strong password.
2. Allow only your current development IP in Atlas Network Access.
3. Copy the application connection string into `.env`.
4. URL-encode special characters in the database username/password.
5. Never commit `.env`.

## Cognito

Set `AWS_REGION`, `COGNITO_USER_POOL_ID`, and `COGNITO_CLIENT_ID` from your Cognito User Pool and app client. The Cognito middleware verifies access tokens and is mounted on protected task routes. Keep the user-pool ID and app-client ID aligned with the frontend Cognito configuration.

## Tests

`npm test` runs HTTP tests without a MongoDB connection or AWS credentials.

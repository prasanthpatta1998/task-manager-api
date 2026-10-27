# Next implementation steps

This starter contains the API foundation, runtime configuration, Cognito JWT verification middleware,
and initial tests. It does not yet implement persisted users, projects, tasks, comments, or notifications.

Next:
1. Configure `.env` with a real MongoDB Atlas connection string.
2. Run `npm install`, `npm run typecheck`, `npm test`, and `npm run build`.
3. Configure Cognito user pool/app client, then set the three Cognito variables.
4. Implement user profile persistence and project/task CRUD with per-resource authorization.
5. Only then deploy using Terraform.


## Frontend Cognito integration

See the repository-level `INTEGRATION-README-MILESTONE2.md` included in the integration ZIP for the frontend Amplify configuration and local end-to-end sign-in steps.

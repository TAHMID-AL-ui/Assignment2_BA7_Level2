# Project Name: DevPulse
Live URL:

```txt
https://assignment2-ba-7-level2.vercel.app
```
## What I used from the course modules

- Express server setup with `app.ts` and `server.ts`
- Environment variable configuration with `.env`
- PostgreSQL connection using `pg` Pool
- Raw SQL queries with `pool.query()`
- Modular pattern for auth and issues
- Middleware for authentication and error handling
- JWT login system
- bcrypt password hashing
- Basic RBAC for contributor and maintainer
- Common response utility for success and error responses
- Deployment ready build command

## Features

- User signup and login
- JWT based protected routes
- Password is hashed before saving
- Contributor and maintainer roles
- Create bug or feature request
- Get all issues with sort and filter
- Get single issue details
- Contributor can update only own open issue
- Maintainer can update any issue
- Maintainer can also change issue status
- Maintainer can delete any issue

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken


## Environment Setup

Create a `.env` file in the root folder. Example:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/devpulse
JWT_SECRET=replace_this_secret
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
CORS_ORIGIN=*
```

Bcrypt salt round is kept between 8 and 12.


## Database Setup

Run the SQL from this file in PostgreSQL:

```bash
src/db/schema.sql
```

The project has two tables: `users` and `issues`.

## API Endpoints

### Auth

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/signup` | Public |
| POST | `/api/auth/login` | Public |

### Issues

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/issues` | Authenticated |
| GET | `/api/issues?sort=newest` | Public |
| GET | `/api/issues/:id` | Public |
| PATCH | `/api/issues/:id` | Contributor owner or maintainer |
| DELETE | `/api/issues/:id` | Maintainer only |

For protected routes, send token like this:

```txt
Authorization: <JWT_TOKEN>
```

## Request Examples

Signup:

```json
{
  "name": "John Doe",
  "email": "john.doe@devpulse.com",
  "password": "securePassword123",
  "role": "contributor"
}
```

Login:

```json
{
  "email": "john.doe@devpulse.com",
  "password": "securePassword123"
}
```

Create issue:

```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

Update issue fields:

```json
{
  "title": "Updated database timeout issue",
  "description": "The issue happens when many users send requests at the same time.",
  "type": "bug"
}
```

Maintainer can also update status using the same PATCH route:

```json
{
  "status": "in_progress"
}
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Operation message",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## Database Tables

### users

- id
- name
- email
- password
- role
- created_at
- updated_at

### issues

- id
- title
- description
- type
- status
- reporter_id
- created_at
- updated_at


For Vercel, the project also has `vercel.json`.

## Final Submission

```txt
GitHub Repo: https://github.com/TAHMID-AL-ui/Assignment2_BA7_Level2.git
Live Deployment: add your public live API link
Interview Video: add your public video link
```

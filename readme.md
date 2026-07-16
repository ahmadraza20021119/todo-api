# Task API

A small CRUD API for managing a to-do list, built with Node.js and Express.

## Run it

    npm install
    node index.js

Server runs on http://localhost:3000

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | / | API info |
| GET | /health | Health check |
| GET | /tasks | List all tasks |
| GET | /tasks/:id | Get one task |
| POST | /tasks | Create a task |
| PUT | /tasks/:id | Update a task |
| DELETE | /tasks/:id | Delete a task |

## Example request

    curl.exe -i http://localhost:3000/tasks/1

Response:

    HTTP/1.1 200 OK
    Content-Type: application/json; charset=utf-8

    {"id":1,"title":"Buy milk","done":false}

## Swagger UI

Available at http://localhost:3000/docs — full CRUD cycle tested via "Try it out".

![Swagger UI](swagger-screenshot.png)

## Notes

Data is stored in memory only — restarting the server resets all tasks back to the original 3 examples.

## AI vs me (Stage 7)

**Prompt I sent:**

> Build a REST API for a to-do list using Node.js and Express. It needs these endpoints: GET / (API info), GET /health (health check), GET /tasks (list all tasks), GET /tasks/:id (get one task), POST /tasks (create a task), PUT /tasks/:id (update a task), DELETE /tasks/:id (delete a task). Each task should have these fields: id (number), title (string), done (boolean). When creating a task, validate that title is present and not empty, otherwise return status 400 with a JSON error message; on success return status 201 with the created task. When looking up, updating, or deleting a task that doesn't exist, return status 404 with a JSON error message. Deleting a task successfully should return status 204 with no body. Store the data in-memory (a JavaScript array, no database — data resets when the server restarts). Also set up Swagger UI so I can test all endpoints interactively at /docs, using the swagger-ui-express package.

**What the AI did better:**
- Stricter validation — rejects `done` if it isn't a real boolean, rejects `title` if it isn't a string (I only checked truthiness).
- Trims whitespace from `title` before storing it.
- Configurable port via `process.env.PORT || 3000` instead of my hardcoded `3000`.
- A catch-all `404` for any undefined route — I only 404 on unmatched task ids, not unknown paths entirely.
- Exports the app (`module.exports = app`) so it's testable/importable — I didn't set that up.

**What it quietly decided without being asked:**
- Added an `uptime` field to `/health` that I never specified.
- Different error message wording (`"Task with id 99 not found"` vs my `"Task 99 not found"`).
- Used a separate incrementing `nextId` counter instead of recomputing `max(id)+1` like I did.
- Expanded `GET /` with a full endpoint map, more detailed than my "API info."

**What my prompt forgot to specify:**
- Exact error message text/format
- Whether unknown routes (not just unknown ids) should 404
- What "API info" at `GET /` should actually contain
- Type-strictness of validation

**Rematch — what I'd change:** I'd add to my prompt: "return exact error messages: 'Task {id} not found' and 'title is required'" and "reject non-string/non-boolean field types with 400" — since the AI made reasonable but different choices on both, and being explicit would make the two versions match exactly.
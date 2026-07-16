# To-Do List REST API

A simple in-memory REST API for a to-do list, built with Node.js and Express, with interactive Swagger UI documentation.

## Setup

```bash
npm install
npm start
```

The server runs on `http://localhost:3000` by default (set the `PORT` env var to change it).

## Interactive docs

Open **http://localhost:3000/docs** for Swagger UI, where you can try out every endpoint directly in the browser.

## Endpoints

| Method | Path          | Description                       |
|--------|---------------|-----------------------------------|
| GET    | /             | API info                          |
| GET    | /health       | Health check                      |
| GET    | /tasks        | List all tasks                    |
| GET    | /tasks/:id    | Get one task                      |
| POST   | /tasks        | Create a task                     |
| PUT    | /tasks/:id    | Update a task                     |
| DELETE | /tasks/:id    | Delete a task                     |

### Task shape

```json
{ "id": 1, "title": "Buy groceries", "done": false }
```

### Notes

- Data is stored in memory (a plain array) and resets whenever the server restarts.
- `POST /tasks` requires a non-empty `title`; otherwise it returns `400` with `{ "error": "..." }`. On success it returns `201` with the created task.
- `GET/PUT/DELETE /tasks/:id` return `404` with `{ "error": "..." }` if the task doesn't exist.
- `DELETE /tasks/:id` returns `204` with no body on success.

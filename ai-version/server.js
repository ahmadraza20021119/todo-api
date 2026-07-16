const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ---- In-memory data store ----
let tasks = [
  { id: 1, title: 'Learn Express', done: false },
  { id: 2, title: 'Build a REST API', done: false },
];
let nextId = 3;

// ---- Swagger UI ----
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ---- Routes ----

// GET / - API info
app.get('/', (req, res) => {
  res.json({
    name: 'To-Do List API',
    version: '1.0.0',
    description: 'A simple in-memory REST API for managing to-do tasks.',
    docs: '/docs',
    endpoints: {
      health: 'GET /health',
      listTasks: 'GET /tasks',
      getTask: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
    },
  });
});

// GET /health - health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// GET /tasks - list all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - get one task
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  res.json(task);
});

// POST /tasks - create a task
app.post('/tasks', (req, res) => {
  const { title, done } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required and cannot be empty' });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    done: typeof done === 'boolean' ? done : false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - update a task
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  const { title, done } = req.body || {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    task.done = done;
  }

  res.json(task);
});

// DELETE /tasks/:id - delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task with id ${id} not found` });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ---- 404 fallback for unknown routes ----
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`To-Do API listening on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});

module.exports = app;

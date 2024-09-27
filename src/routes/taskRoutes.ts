import { Router } from 'express';
import * as taskModel from '../models/taskModel';
import { Request } from 'express';

const router = Router();

// Get all tasks for the authenticated user
router.get('/', async (req: Request, res) => {
  const userId = req.user?.id; // Assuming user ID is stored in req.user after JWT verification
  const tasks = await taskModel.getAllTasks(userId);
  res.json(tasks);
});

// Get paginated tasks for the authenticated user
router.get('/page', async (req: Request, res) => {
  const userId = req.user?.id;

  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 0;
  const offset = page * limit;

  const tasks = await taskModel.getTasks(userId, Number(limit), Number(offset));

  const allTasksQuery = await taskModel.getAllTasks(userId);

  const totalTasks = allTasksQuery.length;

  res.json({
    tasks,
    totalTasks,
    hasNextPage: offset + limit < totalTasks,
  });
});

// Add a task for the authenticated user
router.post('/', async (req: Request, res) => {
  const userId = req.user?.id;
  const { text, status } = req.body;
  const newTask = await taskModel.addTask(userId, text, status);
  res.status(201).json(newTask);
});

// Get a specific task for the authenticated user
router.get('/:id', async (req: Request, res) => {
  const userId = req.user?.id;
  const task = await taskModel.getTask(userId, Number(req.params.id));
  res.json(task);
});

// Edit a task for the authenticated user
router.put('/:id', async (req: Request, res) => {
  const userId = req.user?.id;
  const username = req.user?.username
  const { id, text, status } = req.body;
  await taskModel.editTask(userId, id, text, status);
  res.status(204).send();
});

// Remove a task for the authenticated user
router.delete('/:id', async (req: Request, res) => {
  const userId = req.user?.id;
  await taskModel.removeTask(userId, Number(req.params.id));
  res.status(204).send();
});

export default router;

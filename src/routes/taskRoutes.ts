import express, { Request, Response } from 'express';
import { getTasks, addTask, removeTask, editTask, spawnTasks, getTask, getAllTasks } from '../models/taskModel';
import { body, param, validationResult } from 'express-validator';

const router = express.Router();

router.get('/tasks', async (req, res) => {

  const limit = parseInt(req.query.limit as string) || 10;
  const page = parseInt(req.query.page as string) || 0;
  const offset = page * limit;

  const tasks = await getTasks(limit, offset);
  const allTasksQuery = await getAllTasks();
  const totalTasks = allTasksQuery.length;

  res.json({
    tasks,
    totalTasks,
    hasNextPage: offset + limit < totalTasks,
  });

  console.log('Got tasks!')
});

router.get('/spawn', async (req, res) => {
  const tasks = await spawnTasks();
  res.json('Spawned 12 tasks!');
  console.log('Spawned 12 tasks!')
});

router.post('/tasks', [
  body('text')
    .trim()
    .escape()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Text must be between 1 and 1000 characters'),
  body('status')
    .isIn(['pending', 'done', 'on-hold'])
    .withMessage('Invalid status value'),
], async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text, status } = req.body;

  try {
    const newTask = await addTask(text, status);
    res.status(201).json(newTask);
    console.log('Added task: ' + 'text: ' + text + ', status: ' + status)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task: ' + error });
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await removeTask(parseInt(id, 10));
    res.status(200).json({ message: `Deleted task N. ${id}` });
    console.log('Deleted task N. ' + id)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task: ' + error });
  }
});

router.put('/tasks/:id', [
  body('text')
    .trim()
    .escape()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Text must be between 1 and 1000 characters'),
  body('status')
    .isIn(['pending', 'done', 'on-hold'])
    .withMessage('Invalid status value'),
], async (req: Request, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { text, status } = req.body;

  // check diffs
  const task = await getTask(parseInt(id, 10));

  const taskText = task[0].text;
  const taskStatus = task[0].status;

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (taskText === text && taskStatus === status) {
    res.status(304).json('No update needed for task.');
  } else {
    try {
      await editTask(parseInt(id, 10), text, status);
      res.status(200).json('Updated task: ' + 'text: ' + text + ', status: ' + status);
      console.log('Updated task: ' + 'text: ' + text + ', status: ' + status)
    } catch (error) {
      res.status(500).json({ error: 'Failed to edit task: ' + error });
    }
  }

});

export default router;
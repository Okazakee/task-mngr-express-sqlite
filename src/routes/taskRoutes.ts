import express from 'express';
import { getTasks, addTask, removeTask, editTask, spawnTasks, getTask, getAllTasks } from '../models/taskModel';

const router = express.Router();

router.get('/', async (req, res) => {

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

router.post('/', async (req, res) => {
  const { text, status } = req.body;

  try {
    const newTask = await addTask(text, status);
    res.status(201).json(newTask);
    console.log('Added task: ' + 'text: ' + text + ', status: ' + status)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task: ' + error });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await removeTask(parseInt(id, 10));
    res.status(200).json({ message: `Deleted task N. ${id}` });
    console.log('Deleted task N. ' + id)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task: ' + error });
  }
});

router.put('/:id', async (req, res) => {
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
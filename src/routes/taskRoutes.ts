import express from 'express';
import { getAllTasks, addTask } from '../models/taskModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { text, state } = req.body;

  const validStates = ['done', 'pending', 'on-hold'];

  // Validate the state value
  if (!state) {
    const newTask = await addTask(text, 'pending'); //set default value
    res.status(201).json(newTask);
    return
  } else if (!validStates.includes(state)) {
    return res.status(422).json({ error: 'Invalid state value' });
  }

  try {
    const newTask = await addTask(text, state);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task: ' + error });
  }
});

// Add other routes for update and delete

export default router;
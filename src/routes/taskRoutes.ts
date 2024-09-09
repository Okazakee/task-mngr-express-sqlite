import express from 'express';
import { getAllTasks, addTask } from '../models/taskModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await getAllTasks();
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { text, completed } = req.body;
  const newTask = await addTask(text, completed);
  res.status(201).json(newTask);
});

// Add other routes for update and delete

export default router;
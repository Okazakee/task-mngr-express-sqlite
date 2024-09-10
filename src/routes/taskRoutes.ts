import express from 'express';
import { getAllTasks, addTask, removeTask, editTask } from '../models/taskModel';

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await getAllTasks();
  res.json(tasks.reverse());
  console.log('Got all the tasks!')
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

  try {
    const updatedTask = await editTask(parseInt(id, 10), text, status);
    res.status(201).json('Updated task: ' + 'text: ' + text + ', status: ' + status);
    console.log('Updated task: ' + 'text: ' + text + ', status: ' + status)
  } catch (error) {
    res.status(500).json({ error: 'Failed to edit task: ' + error });
  }
});

export default router;
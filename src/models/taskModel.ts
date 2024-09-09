import { openDb } from '../db/database';

export async function getAllTasks() {
  const db = await openDb();
  return db.all('SELECT * FROM tasks');
}

export async function addTask(text: string, completed: boolean) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO tasks (text, completed) VALUES (?, ?)',
    text,
    completed
  );
  return { id: result.lastID, text, completed: completed };
}

// Add other functions for update and delete
import { openDb } from '../db/database';

export async function getAllTasks() {
  const db = await openDb();
  return db.all('SELECT * FROM tasks');
}

export async function addTask(text: string, state?: string) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO tasks (text, state) VALUES (?, ?)',
    text,
    state
  );
  return { id: result.lastID, text, state };
}

// Add other functions for update and delete
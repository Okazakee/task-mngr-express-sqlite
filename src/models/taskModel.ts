import { openDb } from '../db/database';

export async function getAllTasks() {
  const db = await openDb();
  return db.all('SELECT * FROM tasks');
}

export async function addTask(text: string, status?: string) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO tasks (text, status) VALUES (?, ?)',
    text,
    status ? status : 'pending'
  );
  return { id: result.lastID, text, status };
}

export async function editTask(id: number, text: string, status?: string) {
  const db = await openDb();
  const result = await db.run(
    'UPDATE tasks SET text = ?, status = ? WHERE id = ?',
    text,
    status ? status : 'pending',
    id
  );
  return `Correctly deleted task N. ${id}`;
}

export async function removeTask(id: number) {
  const db = await openDb();
  const result = await db.run(
    'DELETE FROM tasks WHERE id = ?',
    id
  );
  return `Correctly deleted task N. ${id}`;
}
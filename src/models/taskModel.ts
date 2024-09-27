import { openDb } from '../db/database';

// Get all tasks for a specific user
export async function getAllTasks(userId: number) {
  const db = await openDb();
  return await db.all('SELECT * FROM tasks WHERE user_id = ?', [userId]);
}

// Get tasks with pagination for a specific user
export async function getTasks(userId: number, limit: number, offset: number) {
  const db = await openDb();
  return await db.all('SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?',
    [userId, limit, offset]
  );
}

// Add a task for a specific user
export async function addTask(userId: number, text: string, status?: string) {
  const db = await openDb();
  const result = await db.run(
    'INSERT INTO tasks (text, status, user_id) VALUES (?, ?, ?)',
    text,
    status ? status : 'pending',
    userId
  );
  return { id: result.lastID, text, status };
}

// Get a specific task for a specific user
export async function getTask(userId: number, id: number) {
  const db = await openDb();
  return await db.all('SELECT * FROM tasks WHERE user_id = ? AND id = ?',
    [userId, id]
  );
}

// Edit a task for a specific user
export async function editTask(userId: number, id: number, text: string, status?: string) {
  const db = await openDb();
  return await db.run(
    'UPDATE tasks SET text = ?, status = ? WHERE id = ? AND user_id = ?',
    text,
    status ? status : 'pending',
    id,
    userId
  );
}

// Remove a task for a specific user
export async function removeTask(userId: number, id: number) {
  const db = await openDb();
  return await db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
}

// Spawn tasks for testing (optional: consider adding userId here)
export async function spawnTasks() {
  const db = await openDb();
  // Consider using userId when inserting test tasks
  // Example userId could be 1 for all tasks
  const userId = 1; // This should ideally be dynamic
  await db.run('INSERT INTO tasks (text, status, user_id) VALUES (?, ?, ?)', 'task1', 'done', userId);
  await db.run('INSERT INTO tasks (text, status, user_id) VALUES (?, ?, ?)', 'task2', 'on-hold', userId);
  // Add more tasks as needed...
  return `Correctly spawned tasks for userId ${userId}`;
}

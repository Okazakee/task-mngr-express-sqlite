import { openDb } from '../db/database';

export async function getAllTasks() {
  const db = await openDb();

  return await db.all('SELECT * FROM tasks');
}

export async function getTasks(limit: number, offset: number) {
  const db = await openDb();

  return await db.all('SELECT * FROM tasks ORDER BY id DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
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

export async function getTask(id: number) {
  const db = await openDb();

  return await db.all('SELECT * FROM tasks WHERE id = ?',
    id
  );
}

export async function editTask(id: number, text: string, status?: string) {
  const db = await openDb();

  return await db.run(
    'UPDATE tasks SET text = ?, status = ? WHERE id = ?',
    text,
    status ? status : 'pending',
    id
  );
}

export async function removeTask(id: number) {
  const db = await openDb();
  return await db.run(
    'DELETE FROM tasks WHERE id = ?',
    id
  );
}

export async function spawnTasks() {
  const db = await openDb();
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task1', 'done');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task2', 'on-hold');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task3', 'pending');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task4', 'done');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task5', 'on-hold');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task6', 'pending');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task7', 'done');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task8', 'on-hold');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task9', 'pending');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task10', 'done');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task11', 'on-hold');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task12', 'pending');
  `);
  return `Correctly spawned 12 tasks`;
}
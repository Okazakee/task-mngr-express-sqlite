import { openDb } from './database';

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      status TEXT NOT NULL
    );
  `);

  // Insert initial data into the table
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task1', 'done');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task2', 'on-hold');
  `);
  await db.run(`
    INSERT INTO tasks (text, status) VALUES ('task3', 'pending');
  `);

  console.log('Database initialized');
}

initDb().catch(console.error);
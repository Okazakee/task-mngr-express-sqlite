import { openDb } from './database';

async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      state TEXT NOT NULL
    )
  `);
  console.log('Database initialized');
}

initDb().catch(console.error);

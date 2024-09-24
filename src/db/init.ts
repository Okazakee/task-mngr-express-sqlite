import { openDb } from './database';
import bcrypt from 'bcrypt';

async function initDb() {
  const db = await openDb();

  // Create the users and tasks tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      propic BLOB
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      status TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Hash the password before inserting into the database
  const hashedPassword = await bcrypt.hash('testpw123', 10);

  // Insert a fixed user with an email, username, and hashed password
  await db.run(`
    INSERT INTO users (email, username, password)
    VALUES ('user@example.com', 'fixeduser', ?);
  `, [hashedPassword]);

  // Retrieve the ID of the inserted user
  const user = await db.get('SELECT id FROM users WHERE email = ?', ['user@example.com']);
  const userId = user.id;

  // Insert tasks and associate them with the user's ID
  await db.run(`
    INSERT INTO tasks (text, status, user_id) VALUES ('task1', 'done', ?);
  `, [userId]);
  await db.run(`
    INSERT INTO tasks (text, status, user_id) VALUES ('task2', 'on-hold', ?);
  `, [userId]);
  await db.run(`
    INSERT INTO tasks (text, status, user_id) VALUES ('task3', 'pending', ?);
  `, [userId]);

  console.log('Database initialized with one user and three tasks');
}

initDb().catch(console.error);

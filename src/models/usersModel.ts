import { openDb } from '../db/database';

export async function uploadPropic(profilePicBuffer: Buffer, userId: number) {
  const db = await openDb();

  return await db.run(`
    UPDATE users
    SET propic = ?
    WHERE id = ?
  `, [profilePicBuffer, userId]);
}

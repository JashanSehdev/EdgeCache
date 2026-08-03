import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize @libsql local SQLite client
const dbPath = path.join(__dirname, 'app.db');
const db = createClient({
  url: `file:${dbPath}`,
});

// Enable WAL mode & performance tuning
await db.execute('PRAGMA journal_mode = WAL;');
await db.execute('PRAGMA synchronous = NORMAL;');

// Create Table
await db.execute(`
  CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT,
    created_at INTEGER NOT NULL)
`);

/**
 * INSERT Asset
 */
export async function add_entry(filename, size, mimeType) {
  const created_at = Date.now();
  const safeMimeType = mimeType ?? null;
  const result = await db.execute({
    sql: 'INSERT INTO assets (filename, size, mime_type, created_at) VALUES (?, ?, ?, ?)',
    args: [filename, size, safeMimeType, created_at],
  });

  return Number(result.lastInsertRowid); // Returns the ID of inserted row
}

/**
 * SELECT Single Asset by Filename
 */
export async function get_entry_by_filename(filename) {
  const result = await db.execute({
    sql: 'SELECT * FROM assets WHERE filename = ?',
    args: [filename],
  });

  return result.rows[0]; // Returns undefined if not found
}

/**
 * SELECT All Assets
 */
export async function get_all_entries() {
  const result = await db.execute('SELECT * FROM assets ORDER BY created_at DESC');
  return result.rows; // Returns array of objects
}

/**
 * DELETE Asset by Filename
 */
export async function delete_asset_by_filename (filename) {
  const result = await db.execute({
    sql: 'DELETE FROM assets WHERE filename = ?',
    args: [filename],
  });

  return result.rowsAffected; // Returns number of deleted rows
}

export default db;
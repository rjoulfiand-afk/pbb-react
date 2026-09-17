import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export const initDB = () => {
  if (Platform.OS === 'web') {
    console.log("⚠️ Mode Web terdeteksi! Database SQLite dimatikan.");
    return;
  }

  try {
    const db = SQLite.openDatabaseSync('primenotes.db');

    db.execSync(`
      CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, priority TEXT, due_date TEXT, detail TEXT, is_completed INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT NOT NULL, color TEXT, icon TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS savings (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, purpose TEXT NOT NULL, saved_at TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount INTEGER NOT NULL, description TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS targets (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, amount INTEGER NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT NOT NULL, account_number TEXT NOT NULL, account_name TEXT NOT NULL, qr_image_path TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS portal_links (id INTEGER PRIMARY KEY AUTOINCREMENT, lemari TEXT NOT NULL, judul TEXT NOT NULL, url TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
      CREATE TABLE IF NOT EXISTS activity_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, title TEXT NOT NULL, description TEXT, icon TEXT, color TEXT, table_name TEXT, payload TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
    `);
    console.log("🔥 Database Prime Notes berhasil di-setup di HP!");
  } catch (error) {
    console.log("Gagal bikin database: ", error);
  }
};



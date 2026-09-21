import { SQLiteDatabase } from 'expo-sqlite';

export const setupDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS savings (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        amount INTEGER, 
        purpose TEXT, 
        saved_at TEXT, 
        created_at TEXT, 
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        amount INTEGER, 
        description TEXT, 
        created_at TEXT, 
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        priority TEXT, 
        due_date TEXT, 
        detail TEXT, 
        is_completed INTEGER DEFAULT 0, 
        created_at TEXT, 
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        title TEXT, 
        content TEXT, 
        icon TEXT, 
        color TEXT, 
        created_at TEXT, 
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY, 
        value TEXT
      );
      
      CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        provider TEXT NOT NULL, 
        account_number TEXT NOT NULL, 
        account_name TEXT NOT NULL, 
        qr_image_path TEXT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );


      CREATE TABLE IF NOT EXISTS portal_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        lemari TEXT NOT NULL, 
        judul TEXT NOT NULL, 
        url TEXT NOT NULL, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 🛡️ TABEL WAJIB UNTUK MENCEGAH LOOPING LOGIN & SESI
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS session (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        is_logged_in INTEGER DEFAULT 0,
        username TEXT
      );
    `);
    console.log("🔥 Database PrimeNotes v2 Siap Tempur & Stabil!");
  } catch (error) {
    console.error("Gagal bangun pondasi database: ", error);
    throw error;
  }
};
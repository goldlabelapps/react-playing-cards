import mysql from 'mysql2/promise';

export interface FlashScene {
  id: string;
  title: string;
  prompt: string;
  movie: string;
  speed: number;
  created_at?: string;
}

const SEED_SCENES: FlashScene[] = [
  {
    id: 'seed-ace-flip',
    title: 'Ace of Spades 3D Flip',
    prompt: 'Deal Ace of Spades with a 3D flip on dark slate stage',
    movie: 'logo',
    speed: 1.2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-starfighter',
    title: 'Starfighter Combat Maneuver',
    prompt: 'Starfighter hyperspace jump with rotating shield matrix',
    movie: 'starfighter',
    speed: 1.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-hud-boot',
    title: 'Macromedia HUD Boot Sequence',
    prompt: 'Classic vector telemetry HUD radar sweep',
    movie: 'hudMacromedia',
    speed: 1.0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-card-spread',
    title: 'Classic Card Fan Spread',
    prompt: 'Royal flush spread across emerald felt',
    movie: 'cardFlip',
    speed: 1.1,
    created_at: new Date().toISOString(),
  },
];

// In-memory fallback cache for serverless environments (e.g. Vercel preview)
let memoryCache: FlashScene[] = [...SEED_SCENES];

let pool: mysql.Pool | null = null;
let isInitialized = false;

function getPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.DATABASE_HOST;
  const user = process.env.DATABASE_USER || 'wpuser';
  const password = process.env.DATABASE_PASSWORD || 'wppassword';
  const database = process.env.DATABASE_NAME || 'modern_flash_dev';
  const port = parseInt(process.env.DATABASE_PORT || '3306', 10);

  // If host is absent, rely on in-memory store
  if (!host) {
    return null;
  }

  try {
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 2000,
    });
    return pool;
  } catch {
    return null;
  }
}

async function ensureTable(): Promise<void> {
  if (isInitialized) return;
  const db = getPool();
  if (!db) return;

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS flash_scenes (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        prompt TEXT NOT NULL,
        movie VARCHAR(64) DEFAULT 'logo',
        speed FLOAT DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed table if empty
    const [rows] = await db.query<mysql.RowDataPacket[]>('SELECT COUNT(*) as count FROM flash_scenes');
    if (rows[0]?.count === 0) {
      for (const scene of SEED_SCENES) {
        await db.query(
          'INSERT IGNORE INTO flash_scenes (id, title, prompt, movie, speed) VALUES (?, ?, ?, ?, ?)',
          [scene.id, scene.title, scene.prompt, scene.movie, scene.speed]
        );
      }
    }
    isInitialized = true;
  } catch {
    // Database unavailable, fallback to memory cache
  }
}

export async function getScenes(): Promise<FlashScene[]> {
  const db = getPool();
  if (!db) {
    return memoryCache;
  }

  try {
    await ensureTable();
    const [rows] = await db.query<mysql.RowDataPacket[]>(
      'SELECT id, title, prompt, movie, speed, created_at FROM flash_scenes ORDER BY created_at DESC LIMIT 20'
    );
    if (!rows || rows.length === 0) {
      return memoryCache;
    }
    return rows.map((r) => ({
      id: String(r.id),
      title: String(r.title),
      prompt: String(r.prompt),
      movie: String(r.movie),
      speed: Number(r.speed),
      created_at: r.created_at ? new Date(r.created_at).toISOString() : undefined,
    }));
  } catch {
    return memoryCache;
  }
}

export async function saveScene(scene: Omit<FlashScene, 'id' | 'created_at'>): Promise<FlashScene> {
  const newScene: FlashScene = {
    id: 'scene-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6),
    title: scene.title.trim() || 'Untitled Animation',
    prompt: scene.prompt.trim(),
    movie: scene.movie || 'logo',
    speed: scene.speed || 1.0,
    created_at: new Date().toISOString(),
  };

  const db = getPool();
  if (db) {
    try {
      await ensureTable();
      await db.query(
        'INSERT INTO flash_scenes (id, title, prompt, movie, speed) VALUES (?, ?, ?, ?, ?)',
        [newScene.id, newScene.title, newScene.prompt, newScene.movie, newScene.speed]
      );
    } catch {
      // Memory fallback on query error
      memoryCache.unshift(newScene);
      return newScene;
    }
  }

  memoryCache.unshift(newScene);
  return newScene;
}

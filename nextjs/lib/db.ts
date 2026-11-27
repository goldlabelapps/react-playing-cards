import { getAdminDb } from './firebase-admin';

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
    id: 'seed-flash-story',
    title: 'The Story of Flash',
    prompt: 'The Story of Flash: Iconic lightning bolt vector animation',
    movie: 'FlashStory',
    speed: 1.0,
    created_at: new Date().toISOString(),
  },
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

// In-memory fallback cache for environments without Firebase credentials
const memoryCache: FlashScene[] = [...SEED_SCENES];
let isSeeded = false;

async function seedFirestoreIfEmpty(): Promise<void> {
  if (isSeeded) return;
  const db = getAdminDb();
  if (!db) return;

  try {
    const snapshot = await db.collection('flash_scenes').limit(1).get();
    if (snapshot.empty) {
      const batch = db.batch();
      for (const scene of SEED_SCENES) {
        const ref = db.collection('flash_scenes').doc(scene.id);
        batch.set(ref, {
          title: scene.title,
          prompt: scene.prompt,
          movie: scene.movie,
          speed: scene.speed,
          created_at: scene.created_at,
        });
      }
      await batch.commit();
    }
    isSeeded = true;
  } catch {
    // Permission or credential error: silently fallback to memoryCache
  }
}

export async function getScenes(): Promise<FlashScene[]> {
  const db = getAdminDb();
  if (!db) {
    return memoryCache;
  }

  try {
    await seedFirestoreIfEmpty();
    const snapshot = await db
      .collection('flash_scenes')
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();

    if (snapshot.empty) {
      return memoryCache;
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: String(data.title || 'Untitled Animation'),
        prompt: String(data.prompt || ''),
        movie: String(data.movie || 'logo'),
        speed: Number(data.speed || 1.0),
        created_at: data.created_at ? String(data.created_at) : undefined,
      };
    });
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

  const db = getAdminDb();
  if (db) {
    try {
      await db.collection('flash_scenes').doc(newScene.id).set({
        title: newScene.title,
        prompt: newScene.prompt,
        movie: newScene.movie,
        speed: newScene.speed,
        created_at: newScene.created_at,
      });
      memoryCache.unshift(newScene);
      return newScene;
    } catch {
      // Memory fallback on error
    }
  }

  memoryCache.unshift(newScene);
  return newScene;
}

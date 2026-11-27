import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getStorage, type Storage } from 'firebase-admin/storage';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'goldlabel-pr0';

export function getAdminApp(): App | null {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // 1. Explicit Service Account Key passed via environment
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: PROJECT_ID,
        storageBucket: `${PROJECT_ID}.firebasestorage.app`,
      });
    } catch {
      return null;
    }
  }

  // 2. Explicit Google Application Credentials path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      return initializeApp({
        projectId: PROJECT_ID,
        storageBucket: `${PROJECT_ID}.firebasestorage.app`,
      });
    } catch {
      return null;
    }
  }

  // 3. During Next.js static build phase without explicit credentials, avoid metadata server timeout
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return null;
  }

  // 4. GCP VM runtime with default service account (wp-lab-live Compute Engine)
  if (process.env.NODE_ENV === 'production' || process.env.GCP_VM === 'true') {
    try {
      return initializeApp({
        projectId: PROJECT_ID,
        storageBucket: `${PROJECT_ID}.firebasestorage.app`,
      });
    } catch {
      return null;
    }
  }

  return null;
}

export function getAdminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function getAdminAuth(): Auth | null {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminStorage(): Storage | null {
  const app = getAdminApp();
  return app ? getStorage(app) : null;
}

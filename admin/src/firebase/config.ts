import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default configuration from provisioned Firebase project or environment
const defaultFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAxi0EavAGlLZh07vvhm35TIAoWvwsOglI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0003844354.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0003844354',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0003844354.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '605124638988',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:605124638988:web:animeverse'
};

// Check if credentials are saved in localStorage
export function getSavedConfig() {
  try {
    const saved = localStorage.getItem('animeverse_firebase_config');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading saved firebase config:', e);
  }
  return defaultFirebaseConfig;
}

export function saveConfig(config: typeof defaultFirebaseConfig) {
  try {
    localStorage.setItem('animeverse_firebase_config', JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

const activeConfig = getSavedConfig();

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(
    activeConfig.projectId
      ? activeConfig
      : {
          apiKey: "demo-api-key",
          authDomain: "animeverse-demo.firebaseapp.com",
          projectId: "animeverse-demo",
          storageBucket: "animeverse-demo.appspot.com",
          appId: "demo-app-id"
        }
  );
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export function isFirebaseConfigured(): boolean {
  const current = getSavedConfig();
  return Boolean(current.apiKey && current.projectId);
}

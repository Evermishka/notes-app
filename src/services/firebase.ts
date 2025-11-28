import { type FirebaseApp, type FirebaseOptions, getApps, initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type FirebaseEnvKey = (typeof REQUIRED_KEYS)[number];

type RequiredEnvValues = Record<FirebaseEnvKey, string>;

const ensureEnvValue = (key: FirebaseEnvKey): string => {
  const value = import.meta.env[key];

  if (!value) {
    throw new Error(
      `[Firebase] Не задано значение переменной ${key}. Проверьте .env и документацию.`
    );
  }

  return value;
};

let cachedApp: FirebaseApp | null = null;

const buildConfig = (): FirebaseOptions => {
  const envValues = REQUIRED_KEYS.reduce<RequiredEnvValues>((acc, key) => {
    acc[key] = ensureEnvValue(key);
    return acc;
  }, {} as RequiredEnvValues);

  const config: FirebaseOptions = {
    apiKey: envValues.VITE_FIREBASE_API_KEY,
    authDomain: envValues.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envValues.VITE_FIREBASE_PROJECT_ID,
    storageBucket: envValues.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envValues.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envValues.VITE_FIREBASE_APP_ID,
    ...(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
      ? { measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID }
      : {}),
  };
  return config;
};

const createFirebaseApp = (): FirebaseApp => {
  const options = buildConfig();
  return initializeApp(options);
};

export const getFirebaseApp = (): FirebaseApp => {
  if (cachedApp) return cachedApp;

  const apps = getApps();
  if (apps.length > 0) {
    cachedApp = apps[0];
    return cachedApp;
  }

  cachedApp = createFirebaseApp();
  return cachedApp;
};

export const getFirebaseAuth = (): Auth => getAuth(getFirebaseApp());

export const getFirebaseFirestore = (): Firestore => getFirestore(getFirebaseApp());

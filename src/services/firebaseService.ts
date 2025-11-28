import { type FirebaseError } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type CollectionReference,
  type DocumentReference,
  type DocumentSnapshot,
  type Firestore,
  type QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseFirestore } from '@/services/firebase';
import {
  type Auth,
  type User as FirebaseAuthUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { type Note } from '@/entities/note/model/types';
import type { FirestoreNote, SyncQueueRecord, User } from '@/db';

class FirebaseServiceError extends Error {
  public readonly code?: string;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = 'FirebaseServiceError';
    this.code = code;
    if (cause) {
      (this as { cause: unknown }).cause = cause;
    }
    Object.setPrototypeOf(this, FirebaseServiceError.prototype);
  }
}

class FirebaseService {
  private static instance: FirebaseService;
  private readonly auth: Auth;
  private readonly firestore: Firestore;

  private constructor() {
    this.auth = getFirebaseAuth();
    this.firestore = getFirebaseFirestore();
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }

    return FirebaseService.instance;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();
      return { user: this.mapFirebaseUser(firebaseUser), token };
    } catch (error) {
      this.handleError('Не удалось войти. Проверьте email, пароль и интернет-соединение.', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      this.handleError('Не удалось выйти из аккаунта. Попробуйте снова.', error);
    }
  }

  async checkAuth(): Promise<{ user: User; token: string } | null> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) return null;
    try {
      const token = await firebaseUser.getIdToken();
      return { user: this.mapFirebaseUser(firebaseUser), token };
    } catch (error) {
      this.handleError('Не удалось проверить авторизацию.', error);
    }
  }

  onAuthStateChanged(
    callback: (state: {
      user: User | null;
      token: string | null;
      error: FirebaseServiceError | null;
    }) => void
  ): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback({ user: null, token: null, error: null });
        return;
      }

      try {
        const token = await firebaseUser.getIdToken();
        callback({ user: this.mapFirebaseUser(firebaseUser), token, error: null });
      } catch (error) {
        const serviceError = this.createFirebaseServiceError('Не удалось получить токен.', error);
        console.error('[FirebaseService] Не удалось получить токен.', error);
        callback({ user: this.mapFirebaseUser(firebaseUser), token: null, error: serviceError });
      }
    });
  }

  async fetchNotes(): Promise<Note[]> {
    const userId = this.requireCurrentUserId('Не удалось загрузить заметки без авторизации.');
    try {
      const notesCollection = collection(
        this.firestore,
        'notes'
      ) as CollectionReference<FirestoreNote>;
      const notesQuery = query(notesCollection, where('userId', '==', userId));
      const snapshot = await getDocs(notesQuery);
      const mapped = snapshot.docs.map((docSnap) => this.toNote(docSnap));
      return mapped.sort((a, b) => {
        const timeA = Date.parse(a.updatedAt);
        const timeB = Date.parse(b.updatedAt);
        return timeB - timeA;
      });
    } catch (error) {
      this.handleError('Не удалось загрузить заметки с сервера.', error);
    }
  }

  async getNoteById(id: string): Promise<Note | null> {
    await this.requireCurrentUserId('Не удалось получить заметку без авторизации.');
    try {
      const noteRef = doc(this.firestore, 'notes', id) as DocumentReference<FirestoreNote>;
      const noteSnapshot = await getDoc(noteRef);
      if (!noteSnapshot.exists()) return null;
      return this.toNote(noteSnapshot);
    } catch (error) {
      this.handleError('Не удалось получить заметку.', error);
    }
  }

  async createNote(title: string, content: string): Promise<Note> {
    const userId = this.requireCurrentUserId('Не удалось создать заметку без авторизации.');
    try {
      const notesCollection = collection(
        this.firestore,
        'notes'
      ) as CollectionReference<FirestoreNote>;
      const docRef = await addDoc(notesCollection, {
        userId,
        title,
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      const createdSnapshot = await this.waitForTimestampFields(docRef, ['createdAt', 'updatedAt']);
      return this.toNote(createdSnapshot);
    } catch (error) {
      this.handleError('Не удалось создать заметку.', error);
    }
  }

  async updateNote(id: string, title: string, content: string): Promise<Note> {
    this.requireCurrentUserId('Не удалось обновить заметку без авторизации.');
    const noteRef = doc(this.firestore, 'notes', id) as DocumentReference<FirestoreNote>;
    try {
      const snapshot = await getDoc(noteRef);
      if (!snapshot.exists()) {
        throw new FirebaseServiceError('Заметка не найдена.', 'notes/not-found');
      }
      await updateDoc(noteRef, {
        title,
        content,
        updatedAt: serverTimestamp(),
      });
      const afterUpdate = await this.waitForTimestampFields(noteRef, ['createdAt', 'updatedAt']);
      return this.toNote(afterUpdate);
    } catch (error) {
      this.handleError('Не удалось обновить заметку.', error);
    }
  }

  async deleteNote(id: string): Promise<void> {
    this.requireCurrentUserId('Не удалось удалить заметку без авторизации.');
    const noteRef = doc(this.firestore, 'notes', id) as DocumentReference<FirestoreNote>;
    try {
      const snapshot = await getDoc(noteRef);
      if (!snapshot.exists()) {
        throw new FirebaseServiceError('Заметка не найдена.', 'notes/not-found');
      }
      await deleteDoc(noteRef);
    } catch (error) {
      this.handleError('Не удалось удалить заметку.', error);
    }
  }

  async syncNoteRecord(record: SyncQueueRecord): Promise<void> {
    const userId = this.requireCurrentUserId(
      'Не удалось синхронизировать заметку без авторизации.'
    );
    const noteRef = doc(this.firestore, 'notes', record.noteId) as DocumentReference<FirestoreNote>;

    if (record.action === 'delete') {
      await deleteDoc(noteRef);
      return;
    }

    const payload = record.payload;
    if (!payload || typeof payload.title !== 'string' || typeof payload.content !== 'string') {
      throw new FirebaseServiceError(
        'Недостаточно данных для синхронизации заметки.',
        'notes/missing-payload'
      );
    }

    const firestorePayload: FirestoreNote = {
      userId,
      title: payload.title,
      content: payload.content,
      createdAt: payload.createdAt ?? new Date().toISOString(),
      updatedAt: payload.updatedAt ?? new Date().toISOString(),
    };

    await setDoc(noteRef, firestorePayload, { merge: record.action === 'update' });
  }

  private toNote(
    snapshot: QueryDocumentSnapshot<FirestoreNote> | DocumentSnapshot<FirestoreNote>
  ): Note {
    const raw = snapshot.data();
    if (!raw) {
      throw new FirebaseServiceError('Данные заметки отсутствуют.', 'notes/missing-data');
    }
    return {
      id: snapshot.id,
      title: raw.title,
      content: raw.content,
      createdAt: this.normalizeDate(raw.createdAt, 'createdAt'),
      updatedAt: this.normalizeDate(raw.updatedAt, 'updatedAt'),
    };
  }

  private normalizeDate(
    value: string | Timestamp | Date | undefined,
    fieldName: 'createdAt' | 'updatedAt'
  ): string {
    if (!value) {
      throw new FirebaseServiceError(
        `Поле "${fieldName}" не заполнено. Ожидается тип Timestamp или ISO-строка.`,
        'notes/missing-timestamp'
      );
    }
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    return value.toDate().toISOString();
  }

  private async waitForTimestampFields(
    docRef: DocumentReference<FirestoreNote>,
    fields: Array<'createdAt' | 'updatedAt'>
  ): Promise<DocumentSnapshot<FirestoreNote>> {
    const maxAttempts = 5;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        throw new FirebaseServiceError('Заметка не найдена.', 'notes/not-found');
      }

      const raw = snapshot.data();
      if (!raw) {
        throw new FirebaseServiceError('Заметка не найдена.', 'notes/not-found');
      }
      const hasAllFields = fields.every((field) => raw[field] !== undefined && raw[field] !== null);
      if (hasAllFields) {
        return snapshot;
      }

      await this.delay(100 * (attempt + 1));
    }

    throw new FirebaseServiceError(
      'Не удалось дождаться меток времени от сервера.',
      'notes/missing-timestamp'
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private mapFirebaseUser(firebaseUser: FirebaseAuthUser): User {
    const createdAt = firebaseUser.metadata.creationTime ?? new Date().toISOString();
    const email = firebaseUser.email ?? '';
    const username =
      firebaseUser.displayName ?? (email.includes('@') ? email.split('@')[0] : firebaseUser.uid);
    return {
      id: firebaseUser.uid,
      email,
      username,
      createdAt,
    };
  }

  private requireCurrentUserId(message: string): string {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new FirebaseServiceError(message, 'auth/not-authenticated');
    }
    return currentUser.uid;
  }

  private handleError(message: string, error: unknown): never {
    const serviceError = this.createFirebaseServiceError(message, error);
    console.error('[FirebaseService]', message, error);
    throw serviceError;
  }

  private createFirebaseServiceError(message: string, error: unknown): FirebaseServiceError {
    if (error instanceof FirebaseServiceError) {
      return error;
    }

    const firebaseError = error as FirebaseError | undefined;
    if (firebaseError?.code) {
      return new FirebaseServiceError(message, firebaseError.code, error);
    }

    return new FirebaseServiceError(message, undefined, error);
  }
}

export const firebaseService = FirebaseService.getInstance();
export { FirebaseServiceError };

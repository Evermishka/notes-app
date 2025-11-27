import Dexie from 'dexie';
import { testNotes } from '@/entities/note/api/test-notes';
import type { Note } from '@/entities/note/model/types';

export type StoredNote = Note & {
  synced: boolean;
};

export type SyncAction = 'create' | 'update' | 'delete';

export interface SyncQueueRecord {
  id?: number;
  action: SyncAction;
  noteId: string;
  payload: Partial<Note>;
  timestamp: string;
  error?: string;
}

class NotesDexie extends Dexie {
  notes!: Dexie.Table<StoredNote, string>;
  syncQueue!: Dexie.Table<SyncQueueRecord, number>;

  constructor() {
    super('notes-app');
    this.version(1).stores({
      notes: '&id, title, updatedAt, synced',
      syncQueue: '++id, noteId, action, timestamp',
    });
  }
}

export const db = new NotesDexie();

export const ensureDbReady = async (): Promise<void> => {
  if (!db.isOpen()) {
    await db.open();
  }
  await seedNotes();
};

export const seedNotes = async (): Promise<void> => {
  const count = await db.notes.count();
  if (count > 0) return;
  const records: StoredNote[] = testNotes.map((note) => ({ ...note, synced: true }));
  await db.notes.bulkAdd(records);
};

export const resetNotesStore = (): Promise<void> => db.notes.clear();

import Dexie from 'dexie';
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
    this.version(2).stores({
      notes: '&id, title, content, updatedAt, synced',
      syncQueue: '++id, noteId, action, timestamp',
    });
  }
}

export const db = new NotesDexie();

export const ensureDbReady = async (): Promise<void> => {
  if (!db.isOpen()) {
    await db.open();
  }
};

export const resetNotesStore = (): Promise<void> => db.notes.clear();

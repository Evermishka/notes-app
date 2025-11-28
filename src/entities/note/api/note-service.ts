import type { Note, CreateNoteDTO, UpdateNoteDTO } from '../model/types';
import { db, ensureDbReady } from '@/shared/db';
import type { StoredNote, SyncQueueRecord } from '@/shared/db';
import { syncService } from '@/shared/services/syncService';

class NoteService {
  private static instance: NoteService;
  private readonly initPromise: Promise<void>;
  private pendingQueueInitialized = false;

  private constructor() {
    this.initPromise = ensureDbReady();
  }

  static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  private async ready(): Promise<void> {
    await this.initPromise;
    await this.ensurePendingQueue();
  }

  private mapStoredNote(storedNote: StoredNote, queueRecord?: SyncQueueRecord): Note {
    const { synced, ...note } = storedNote;
    const hasPending = Boolean(queueRecord);
    return {
      ...note,
      synced: synced && !hasPending,
      syncError: queueRecord?.error ?? null,
    };
  }

  async create(dto: CreateNoteDTO): Promise<Note> {
    await this.ready();
    const now = new Date().toISOString();
    const storedNote: StoredNote = {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: now,
      updatedAt: now,
      synced: false,
    };
    await db.notes.add(storedNote);
    await syncService.enqueue('create', storedNote.id, this.buildSyncPayload(storedNote));
    const queueRecord = await db.syncQueue.where('noteId').equals(storedNote.id).reverse().first();
    return this.mapStoredNote(storedNote, queueRecord);
  }

  async getAll(): Promise<Note[]> {
    await this.ready();
    const queueRecords = await db.syncQueue.orderBy('timestamp').toArray();
    const queueByNote = new Map<string, SyncQueueRecord>();
    queueRecords.forEach((record) => {
      queueByNote.set(record.noteId, record);
    });

    const storedNotes = await db.notes.orderBy('updatedAt').reverse().toArray();
    return storedNotes.map((storedNote) =>
      this.mapStoredNote(storedNote, queueByNote.get(storedNote.id))
    );
  }

  async getById(id: string): Promise<Note | null> {
    await this.ready();
    const storedNote = await db.notes.get(id);
    if (!storedNote) return null;
    const queueRecord = await db.syncQueue.where('noteId').equals(id).reverse().first();
    return this.mapStoredNote(storedNote, queueRecord);
  }

  async update(id: string, dto: UpdateNoteDTO): Promise<Note | null> {
    await this.ready();
    const existing = await db.notes.get(id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updates: Partial<StoredNote> = {
      updatedAt: now,
      synced: false,
    };
    if (dto.title !== undefined) updates.title = dto.title;
    if (dto.content !== undefined) updates.content = dto.content;

    await db.notes.update(id, updates);
    const updated = await db.notes.get(id);
    if (!updated) return null;
    await syncService.enqueue('update', id, this.buildSyncPayload(updated));
    const queueRecord = await db.syncQueue.where('noteId').equals(id).reverse().first();
    return this.mapStoredNote(updated, queueRecord);
  }

  async delete(id: string): Promise<boolean> {
    await this.ready();
    const existing = await db.notes.get(id);
    if (!existing) return false;
    await db.notes.delete(id);
    await syncService.enqueue('delete', id, {});
    return true;
  }

  private async ensurePendingQueue(): Promise<void> {
    if (this.pendingQueueInitialized) return;
    this.pendingQueueInitialized = true;
    const allNotes = await db.notes.toArray();
    const unsyncedNotes = allNotes.filter((note) => note.synced === false);
    for (const note of unsyncedNotes) {
      const existingInQueue = await db.syncQueue.where('noteId').equals(note.id).first();
      if (existingInQueue) continue;
      await syncService.enqueue('create', note.id, this.buildSyncPayload(note));
    }
  }

  private buildSyncPayload(note: StoredNote): Partial<Note> {
    return {
      title: note.title,
      content: note.content,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }
}

export const noteService = NoteService.getInstance();

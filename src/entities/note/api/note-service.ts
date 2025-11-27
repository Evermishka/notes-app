import type { Note, CreateNoteDTO, UpdateNoteDTO } from '../model/types';
import { db, ensureDbReady } from '@/db';
import type { StoredNote } from '@/db';

class NoteService {
  private static instance: NoteService;
  private readonly initPromise: Promise<void>;

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
  }

  private toDomainNote(storedNote: StoredNote | null | undefined): Note | null {
    if (!storedNote) return null;
    const { synced, ...note } = storedNote;
    void synced;
    return note;
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
    return this.toDomainNote(storedNote)!;
  }

  async getAll(): Promise<Note[]> {
    await this.ready();
    const storedNotes = await db.notes.orderBy('updatedAt').reverse().toArray();
    return storedNotes.map((storedNote) => this.toDomainNote(storedNote)!);
  }

  async getById(id: string): Promise<Note | null> {
    await this.ready();
    const storedNote = await db.notes.get(id);
    return this.toDomainNote(storedNote);
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
    return this.toDomainNote(updated);
  }

  async delete(id: string): Promise<boolean> {
    await this.ready();
    const existing = await db.notes.get(id);
    if (!existing) return false;
    await db.notes.delete(id);
    return true;
  }
}

export const noteService = NoteService.getInstance();

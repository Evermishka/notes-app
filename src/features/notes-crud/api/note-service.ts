import type { Note, CreateNoteDTO, UpdateNoteDTO } from '@/entities/note';
import { testNotes } from '../model/test-notes';

class NoteService {
  private static instance: NoteService;
  private notes: Note[] = testNotes;

  private constructor() {}

  static getInstance(): NoteService {
    if (!NoteService.instance) {
      NoteService.instance = new NoteService();
    }
    return NoteService.instance;
  }

  async create(dto: CreateNoteDTO): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  async getAll(): Promise<Note[]> {
    return [...this.notes];
  }

  async getById(id: string): Promise<Note | null> {
    return this.notes.find((note) => note.id === id) || null;
  }

  async update(id: string, dto: UpdateNoteDTO): Promise<Note | null> {
    const note = this.notes.find((note) => note.id === id);
    if (!note) return null;

    if (dto.title !== undefined) note.title = dto.title;
    if (dto.content !== undefined) note.content = dto.content;
    note.updatedAt = new Date().toISOString();

    return note;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.notes.findIndex((note) => note.id === id);
    if (index === -1) return false;

    this.notes.splice(index, 1);
    return true;
  }
}

export const noteService = NoteService.getInstance();

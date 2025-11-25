import type { Note } from '@/entities/note';
import type { NOTES_ACTIONS } from './notes-actions.const';

export type NotesState = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  selectedNote: Note | null;
  searchQuery: string;
};

export type NotesContextType = NotesState & {
  addNote: (title: string, content: string) => Promise<void>;
  editNote: (id: string, title: string, content: string) => Promise<void>;
  removeNote: (id: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
  setSearchQuery: (query: string) => void;
};

export type NotesAction =
  | { type: typeof NOTES_ACTIONS.SET_LOADING; payload: boolean }
  | { type: typeof NOTES_ACTIONS.SET_NOTES; payload: Note[] }
  | { type: typeof NOTES_ACTIONS.ADD_NOTE; payload: Note }
  | { type: typeof NOTES_ACTIONS.UPDATE_NOTE; payload: Note }
  | { type: typeof NOTES_ACTIONS.REMOVE_NOTE; payload: string }
  | { type: typeof NOTES_ACTIONS.SET_SELECT_NOTE; payload: Note }
  | { type: typeof NOTES_ACTIONS.SET_ERROR; payload: string | null }
  | { type: typeof NOTES_ACTIONS.SET_SEARCH_QUERY; payload: string };

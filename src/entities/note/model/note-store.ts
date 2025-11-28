import type React from 'react';
import type { Note } from './types';
import { firebaseService } from '@/services/firebaseService';

// Error Messages
const ERROR_MESSAGES = {
  LOAD_NOTES_FAILED: 'Не удалось загрузить заметки',
  LOAD_NOTE_FAILED: 'Не удалось загрузить заметку',
  NOTE_NOT_FOUND: 'Заметка не найдена',
  CREATE_NOTE_FAILED: 'Не удалось добавить заметку',
  UPDATE_NOTE_FAILED: 'Не удалось изменить заметку',
  DELETE_NOTE_FAILED: 'Не удалось удалить заметку',
} as const;

// State Type
export type NoteState = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  selectedNote: Note | null;
};

// Action Types
export type NoteAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'REMOVE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: Note | null }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial State
export const initialNoteState: NoteState = {
  notes: [],
  loading: false,
  error: null,
  selectedNote: null,
};

// Reducer
export function noteReducer(state: NoteState, action: NoteAction): NoteState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, error: null };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes], selectedNote: action.payload };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.payload.id ? action.payload : note)),
        selectedNote:
          state.selectedNote?.id === action.payload.id ? action.payload : state.selectedNote,
      };
    case 'REMOVE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        selectedNote: state.selectedNote?.id === action.payload ? null : state.selectedNote,
      };
    case 'SELECT_NOTE':
      return { ...state, selectedNote: action.payload };
    default:
      return state;
  }
}

// Actions

/**
 * Загрузка всех заметок
 */
export const loadNotesAction = async (dispatch: React.Dispatch<NoteAction>): Promise<void> => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const notes = await firebaseService.fetchNotes();

    dispatch({ type: 'SET_NOTES', payload: notes });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.LOAD_NOTES_FAILED;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

/**
 * Загрузка заметки по ID
 */
export const loadNoteAction = async (
  dispatch: React.Dispatch<NoteAction>,
  id: string
): Promise<void> => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const note = await firebaseService.getNoteById(id);

    if (note) {
      dispatch({ type: 'SELECT_NOTE', payload: note });
    } else {
      dispatch({ type: 'SET_ERROR', payload: ERROR_MESSAGES.NOTE_NOT_FOUND });
      throw new Error(ERROR_MESSAGES.NOTE_NOT_FOUND);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.LOAD_NOTE_FAILED;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

/**
 * Создание новой заметки
 */
export const createNoteAction = async (
  dispatch: React.Dispatch<NoteAction>,
  title: string,
  content: string
): Promise<void> => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    const newNote = await firebaseService.createNote(title, content);

    dispatch({ type: 'ADD_NOTE', payload: newNote });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_NOTE_FAILED;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

/**
 * Обновление заметки
 */
export const updateNoteAction = async (
  dispatch: React.Dispatch<NoteAction>,
  id: string,
  title: string,
  content: string
): Promise<void> => {
  try {
    dispatch({ type: 'SET_ERROR', payload: null });

    const updatedNote = await firebaseService.updateNote(id, title, content);

    dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.UPDATE_NOTE_FAILED;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  }
};

/**
 * Удаление заметки
 */
export const deleteNoteAction = async (
  dispatch: React.Dispatch<NoteAction>,
  id: string
): Promise<void> => {
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    await firebaseService.deleteNote(id);
    dispatch({ type: 'REMOVE_NOTE', payload: id });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.DELETE_NOTE_FAILED;
    dispatch({ type: 'SET_ERROR', payload: errorMessage });
    throw error;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

/**
 * Выбор заметки
 */
export const selectNoteAction = (dispatch: React.Dispatch<NoteAction>, note: Note | null): void => {
  dispatch({ type: 'SELECT_NOTE', payload: note });
};

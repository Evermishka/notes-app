import type { Note } from './types';

// Actions Constants
export const NOTE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  REMOVE_NOTE: 'REMOVE_NOTE',
  SET_SELECT_NOTE: 'SET_SELECT_NOTE',
  SET_ERROR: 'SET_ERROR',
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
  | { type: typeof NOTE_ACTIONS.SET_LOADING; payload: boolean }
  | { type: typeof NOTE_ACTIONS.SET_NOTES; payload: Note[] }
  | { type: typeof NOTE_ACTIONS.ADD_NOTE; payload: Note }
  | { type: typeof NOTE_ACTIONS.UPDATE_NOTE; payload: Note }
  | { type: typeof NOTE_ACTIONS.REMOVE_NOTE; payload: string }
  | { type: typeof NOTE_ACTIONS.SET_SELECT_NOTE; payload: Note | null }
  | { type: typeof NOTE_ACTIONS.SET_ERROR; payload: string | null };

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
    case NOTE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case NOTE_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case NOTE_ACTIONS.SET_NOTES:
      return { ...state, notes: action.payload, error: null };
    case NOTE_ACTIONS.ADD_NOTE:
      return { ...state, notes: [action.payload, ...state.notes], selectedNote: action.payload };
    case NOTE_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.payload.id ? action.payload : note)),
        selectedNote:
          state.selectedNote?.id === action.payload.id ? action.payload : state.selectedNote,
      };
    case NOTE_ACTIONS.REMOVE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        selectedNote: state.selectedNote?.id === action.payload ? null : state.selectedNote,
      };
    case NOTE_ACTIONS.SET_SELECT_NOTE:
      return { ...state, selectedNote: action.payload };
    default:
      return state;
  }
}

// Action Creators
export const setLoadingAction = (payload: boolean) => ({
  type: NOTE_ACTIONS.SET_LOADING,
  payload,
});

export const setErrorAction = (payload: string | null) => ({
  type: NOTE_ACTIONS.SET_ERROR,
  payload,
});

export const setNotesAction = (payload: Note[]) => ({
  type: NOTE_ACTIONS.SET_NOTES,
  payload,
});

export const addNoteAction = (payload: Note) => ({
  type: NOTE_ACTIONS.ADD_NOTE,
  payload,
});

export const updateNoteAction = (payload: Note) => ({
  type: NOTE_ACTIONS.UPDATE_NOTE,
  payload,
});

export const removeNoteAction = (payload: string) => ({
  type: NOTE_ACTIONS.REMOVE_NOTE,
  payload,
});

export const selectNoteAction = (payload: Note | null) => ({
  type: NOTE_ACTIONS.SET_SELECT_NOTE,
  payload,
});

// Selectors
export const selectNotes = (state: NoteState) => state.notes;
export const selectLoading = (state: NoteState) => state.loading;
export const selectError = (state: NoteState) => state.error;
export const selectSelectedNote = (state: NoteState) => state.selectedNote;
export const selectNotesCount = (state: NoteState) => state.notes.length;

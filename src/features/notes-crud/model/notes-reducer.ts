import type { NotesAction, NotesState } from './notes-types';
import { NOTES_ACTIONS } from './notes-actions.const';
import { testNotes } from './test-notes';

export const initialState: NotesState = {
  notes: testNotes,
  loading: false,
  error: null,
  selectedNote: null,
  searchQuery: '',
};

export function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case NOTES_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case NOTES_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case NOTES_ACTIONS.SET_NOTES:
      return { ...state, notes: action.payload, error: null };
    case NOTES_ACTIONS.ADD_NOTE:
      return { ...state, notes: [action.payload, ...state.notes], selectedNote: action.payload };
    case NOTES_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map((note) => (note.id === action.payload.id ? action.payload : note)),
      };
    case NOTES_ACTIONS.REMOVE_NOTE:
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    case NOTES_ACTIONS.SET_SELECT_NOTE:
      return { ...state, selectedNote: action.payload };
    case NOTES_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

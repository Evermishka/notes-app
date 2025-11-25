import { NOTES_ACTIONS } from './notes-actions.const';
import type { Note } from '@/entities/note';

export const selectNoteAction = (note: Note | null) => ({
  type: NOTES_ACTIONS.SET_SELECT_NOTE,
  payload: note,
});

export const setNotesAction = (payload: Note[]) => ({
  type: NOTES_ACTIONS.SET_NOTES,
  payload,
});

export const addNoteAction = (payload: Note) => ({
  type: NOTES_ACTIONS.ADD_NOTE,
  payload,
});

export const updateNoteAction = (payload: Note) => ({
  type: NOTES_ACTIONS.UPDATE_NOTE,
  payload,
});

export const removeNoteAction = (payload: string) => ({
  type: NOTES_ACTIONS.REMOVE_NOTE,
  payload,
});

export const setLoadingAction = (payload: boolean) => ({
  type: NOTES_ACTIONS.SET_LOADING,
  payload,
});

export const setErrorAction = (payload: string | null) => ({
  type: NOTES_ACTIONS.SET_ERROR,
  payload,
});

export const setSearchQueryAction = (payload: string) => ({
  type: NOTES_ACTIONS.SET_SEARCH_QUERY,
  payload,
});

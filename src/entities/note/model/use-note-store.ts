import { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import type { NoteState, NoteAction } from './note-store';
import {
  noteReducer,
  initialNoteState,
  loadNotesAction,
  loadNoteAction,
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
  selectNoteAction,
} from './note-store';
import type { Note } from './types';
import { noteService } from '@/entities/note/api';
import { syncService } from '@/shared/services/syncService';

export type NoteActions = {
  load: () => Promise<void>;
  loadById: (id: string) => Promise<void>;
  create: (title: string, content: string) => Promise<void>;
  update: (id: string, title: string, content: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
  select: (note: Note | null) => void;
};

export type NoteDispatchContextType = {
  dispatch: React.Dispatch<NoteAction>;
  actions: NoteActions;
};

// Разделение на два контекста для оптимизации
export const NoteStateContext = createContext<NoteState | undefined>(undefined);
export const NoteDispatchContext = createContext<NoteDispatchContextType | undefined>(undefined);

// Хук для получения state
export const useNoteState = () => {
  const context = useContext(NoteStateContext);
  if (!context) {
    throw new Error('useNoteState должен использоваться внутри NoteProvider');
  }
  return context;
};

// Хук для получения dispatch и actions
export const useNoteDispatch = () => {
  const context = useContext(NoteDispatchContext);
  if (!context) {
    throw new Error('useNoteDispatch должен использоваться внутри NoteProvider');
  }
  return context;
};

// Основной хук, возвращающий всё (для обратной совместимости)
export const useNoteStore = () => {
  const state = useNoteState();
  const { dispatch, actions } = useNoteDispatch();
  return { state, dispatch, actions };
};

// Хук для создания значения контекста (используется в NoteProvider)
export const useNoteContext = () => {
  const [state, dispatch] = useReducer(noteReducer, initialNoteState);

  const actions = useMemo(() => createNoteActions(dispatch), [dispatch]);

  const dispatchValue = useMemo(
    () => ({
      dispatch,
      actions,
    }),
    [dispatch, actions]
  );

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = syncService.subscribeNoteChange(async (noteId) => {
      if (!isMounted) return;
      const updatedNote = await noteService.getById(noteId);
      if (updatedNote && isMounted) {
        dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [dispatch]);

  return { state, dispatchValue };
};

export const createNoteActions = (dispatch: React.Dispatch<NoteAction>): NoteActions => {
  return {
    load: () => loadNotesAction(dispatch),
    loadById: (id: string) => loadNoteAction(dispatch, id),
    create: (title: string, content: string) => createNoteAction(dispatch, title, content),
    update: (id: string, title: string, content: string) =>
      updateNoteAction(dispatch, id, title, content),
    delete: (id: string) => deleteNoteAction(dispatch, id),
    select: (note: Note | null) => selectNoteAction(dispatch, note),
  };
};

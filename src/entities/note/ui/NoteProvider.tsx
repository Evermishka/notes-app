import { type ReactNode, useEffect, useMemo, useReducer } from 'react';
import { noteReducer, initialNoteState } from '../model/note-store';
import { NoteStoreContext } from '../model/use-note-store';
import { setNotesAction } from '../model/note-store';
import { noteService } from '../api';

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [state, dispatch] = useReducer(noteReducer, initialNoteState);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const notes = await noteService.getAll();
        dispatch(setNotesAction(notes));
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };
    loadNotes();
  }, []);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <NoteStoreContext.Provider value={value}>{children}</NoteStoreContext.Provider>;
};

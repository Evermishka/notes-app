import { type ReactNode, useEffect, useMemo, useReducer } from 'react';
import { notifications } from '@mantine/notifications';
import { noteReducer, initialNoteState } from '../model/note-store';
import { NoteStoreContext } from '../model/use-note-store';
import { loadNotesAction } from '../model/note-actions';

interface NoteProviderProps {
  children: ReactNode;
}

export const NoteProvider = ({ children }: NoteProviderProps) => {
  const [state, dispatch] = useReducer(noteReducer, initialNoteState);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        await loadNotesAction(dispatch);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Не удалось загрузить заметки';
        console.error('Failed to load notes:', error);
        notifications.show({
          title: 'Ошибка загрузки',
          message: errorMessage,
          color: 'red',
        });
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

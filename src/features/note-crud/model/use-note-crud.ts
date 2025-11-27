import { useCallback } from 'react';
import { useNoteStore } from '@/entities/note';
import { noteService } from '@/entities/note';
import {
  setLoadingAction,
  setErrorAction,
  addNoteAction,
  updateNoteAction,
  removeNoteAction,
  selectNoteAction,
  loadNotesAction,
  loadNoteAction,
} from '@/entities/note';
import type { CreateNoteDTO, UpdateNoteDTO, Note } from '@/entities/note';

export const useNoteCrud = () => {
  const { dispatch } = useNoteStore();

  const addNote = useCallback(
    async (title: string, content: string): Promise<void> => {
      try {
        dispatch(setLoadingAction(true));
        dispatch(setErrorAction(null));

        const dto: CreateNoteDTO = { title, content };
        const newNote = await noteService.create(dto);

        dispatch(addNoteAction(newNote));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Не удалось добавить заметку';
        dispatch(setErrorAction(errorMessage));
        throw error;
      } finally {
        dispatch(setLoadingAction(false));
      }
    },
    [dispatch]
  );

  const editNote = useCallback(
    async (id: string, title: string, content: string): Promise<void> => {
      try {
        dispatch(setLoadingAction(true));
        dispatch(setErrorAction(null));

        const dto: UpdateNoteDTO = { title, content };
        const updatedNote = await noteService.update(id, dto);

        if (updatedNote) {
          dispatch(updateNoteAction(updatedNote));
        } else {
          const errorMsg = 'Заметка не найдена';
          dispatch(setErrorAction(errorMsg));
          throw new Error(errorMsg);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Не удалось изменить заметку';
        dispatch(setErrorAction(errorMessage));
        throw error;
      } finally {
        dispatch(setLoadingAction(false));
      }
    },
    [dispatch]
  );

  const removeNote = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch(setLoadingAction(true));
        dispatch(setErrorAction(null));

        const success = await noteService.delete(id);

        if (success) {
          dispatch(removeNoteAction(id));
        } else {
          const errorMsg = 'Заметка не найдена';
          dispatch(setErrorAction(errorMsg));
          throw new Error(errorMsg);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Не удалось удалить заметку';
        dispatch(setErrorAction(errorMessage));
        throw error;
      } finally {
        dispatch(setLoadingAction(false));
      }
    },
    [dispatch]
  );

  const fetchNotes = useCallback(async (): Promise<void> => {
    await loadNotesAction(dispatch);
  }, [dispatch]);

  const fetchNote = useCallback(
    async (id: string): Promise<void> => {
      await loadNoteAction(dispatch, id);
    },
    [dispatch]
  );

  const setSelectedNote = useCallback(
    (note: Note | null) => {
      dispatch(selectNoteAction(note));
    },
    [dispatch]
  );

  return {
    addNote,
    editNote,
    removeNote,
    fetchNotes,
    fetchNote,
    setSelectedNote,
  };
};

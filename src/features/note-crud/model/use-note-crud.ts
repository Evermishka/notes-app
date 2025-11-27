import { useCallback } from 'react';
import { useNoteStore } from '@/entities/note';
import { noteService } from '@/entities/note';
import {
  setLoadingAction,
  setErrorAction,
  addNoteAction,
  updateNoteAction,
  removeNoteAction,
  setNotesAction,
  selectNoteAction,
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
          dispatch(setErrorAction('Заметка не найдена'));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Не удалось изменить заметку';
        dispatch(setErrorAction(errorMessage));
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
          dispatch(setErrorAction('Заметка не найдена'));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Не удалось удалить заметку';
        dispatch(setErrorAction(errorMessage));
      } finally {
        dispatch(setLoadingAction(false));
      }
    },
    [dispatch]
  );

  const fetchNotes = useCallback(async (): Promise<void> => {
    try {
      dispatch(setLoadingAction(true));
      dispatch(setErrorAction(null));

      const notes = await noteService.getAll();

      dispatch(setNotesAction(notes));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить заметки';
      dispatch(setErrorAction(errorMessage));
    } finally {
      dispatch(setLoadingAction(false));
    }
  }, [dispatch]);

  const fetchNote = useCallback(
    async (id: string): Promise<void> => {
      try {
        dispatch(setLoadingAction(true));
        dispatch(setErrorAction(null));

        const note = await noteService.getById(id);

        if (note) {
          dispatch(selectNoteAction(note));
        } else {
          dispatch(setErrorAction('Заметка не найдена'));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Не удалось загрузить заметку';
        dispatch(setErrorAction(errorMessage));
      } finally {
        dispatch(setLoadingAction(false));
      }
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

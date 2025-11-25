import type { CreateNoteDTO, Note, UpdateNoteDTO } from '@/entities/note';
import { noteService } from '../api';
import {
  setLoadingAction,
  setErrorAction,
  addNoteAction,
  updateNoteAction,
  removeNoteAction,
  setNotesAction,
  selectNoteAction,
  setSearchQueryAction,
} from './notes-action-creators';
import type { NotesAction } from './notes-types';
export const useNotesActions = (dispatch: React.Dispatch<NotesAction>) => {
  const addNote = async (title: string, content: string): Promise<void> => {
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
  };

  const editNote = async (id: string, title: string, content: string): Promise<void> => {
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
  };

  const removeNote = async (id: string): Promise<void> => {
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
  };

  const fetchNotes = async (): Promise<void> => {
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
  };

  const fetchNote = async (id: string): Promise<void> => {
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
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить заметку';
      dispatch(setErrorAction(errorMessage));
    } finally {
      dispatch(setLoadingAction(false));
    }
  };

  const setSelectedNote = (note: Note | null) => {
    dispatch(selectNoteAction(note));
  };

  const setSearchQuery = (query: string) => {
    dispatch(setSearchQueryAction(query));
  };

  return {
    addNote,
    editNote,
    removeNote,
    fetchNotes,
    fetchNote,
    setSelectedNote,
    setSearchQuery,
  };
};

import { noteService } from '../api';
import type { NoteAction } from './note-store';
import { setLoadingAction, setErrorAction, setNotesAction, selectNoteAction } from './note-store';

/**
 * Асинхронный action creator для загрузки всех заметок
 */
export const loadNotesAction = async (dispatch: React.Dispatch<NoteAction>): Promise<void> => {
  try {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));

    const notes = await noteService.getAll();

    dispatch(setNotesAction(notes));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить заметки';
    dispatch(setErrorAction(errorMessage));
    throw error;
  } finally {
    dispatch(setLoadingAction(false));
  }
};

/**
 * Асинхронный action creator для загрузки заметки по ID
 */
export const loadNoteAction = async (
  dispatch: React.Dispatch<NoteAction>,
  id: string
): Promise<void> => {
  try {
    dispatch(setLoadingAction(true));
    dispatch(setErrorAction(null));

    const note = await noteService.getById(id);

    if (note) {
      dispatch(selectNoteAction(note));
    } else {
      const errorMsg = 'Заметка не найдена';
      dispatch(setErrorAction(errorMsg));
      throw new Error(errorMsg);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить заметку';
    dispatch(setErrorAction(errorMessage));
    throw error;
  } finally {
    dispatch(setLoadingAction(false));
  }
};

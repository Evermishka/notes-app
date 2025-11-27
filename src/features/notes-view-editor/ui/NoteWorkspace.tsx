import { useCallback } from 'react';
import { useNotesSelectors, useNotesContext, DeleteConfirm } from '@/features/notes-crud';
import { Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useViewEditorContext } from '../model';
import { NoteEditor } from './NoteEditor';
import { NoteHeader } from './NoteHeader';
import { NoteViewer } from './NoteViewer';
import { NoteViewerEmptyState } from './NoteViewerEmptyState';
import {
  DELETE_SUCCESS_TITLE,
  DELETE_SUCCESS_MESSAGE,
  DELETE_ERROR_TITLE,
  DELETE_ERROR_MESSAGE,
} from '@/shared/config';

export const NoteWorkspace = () => {
  const { mode, setMode, isDeleteModalOpen, closeDeleteModal } = useViewEditorContext();
  const { currentSelectedNote } = useNotesSelectors();
  const { removeNote } = useNotesContext();

  // [Обработка подтверждения удаления заметки]
  const handleConfirmDelete = useCallback(async (): Promise<void> => {
    if (!currentSelectedNote) return;

    try {
      await removeNote(currentSelectedNote.id);
      closeDeleteModal();
      setMode('view');
      // [Показываем уведомление об успешном удалении]
      notifications.show({
        title: DELETE_SUCCESS_TITLE,
        message: DELETE_SUCCESS_MESSAGE,
        color: 'green',
      });
    } catch {
      // [Показываем уведомление об ошибке]
      notifications.show({
        title: DELETE_ERROR_TITLE,
        message: DELETE_ERROR_MESSAGE,
        color: 'red',
      });
    }
  }, [currentSelectedNote, removeNote, closeDeleteModal, setMode]);

  return (
    <>
      {!currentSelectedNote && <NoteViewerEmptyState />}
      {currentSelectedNote && (
        <Stack gap="md">
          <NoteHeader />
          {mode === 'view' && <NoteViewer />}
          {mode === 'edit' && <NoteEditor />}
        </Stack>
      )}
      {/* [Модальное окно подтверждения удаления] */}
      <DeleteConfirm
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        noteTitle={currentSelectedNote?.title || ''}
      />
    </>
  );
};

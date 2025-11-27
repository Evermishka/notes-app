import { useCallback } from 'react';
import { Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useNoteStore, selectSelectedNote } from '@/entities/note';
import { useNoteCrud } from '@/features/note-crud';
import { useEditorMode } from '@/features/note-editor';
import { NoteEditor, NoteViewer, NoteViewerEmptyState } from '@/features/note-editor';
import { useDeleteModal, DeleteConfirm } from '@/features/note-delete';
import {
  DELETE_SUCCESS_TITLE,
  DELETE_SUCCESS_MESSAGE,
  DELETE_ERROR_TITLE,
  DELETE_ERROR_MESSAGE,
} from '@/shared/config';
import { NoteHeader } from './NoteHeader';

export const NoteWorkspace = () => {
  const { state } = useNoteStore();
  const selectedNote = selectSelectedNote(state);
  const { removeNote } = useNoteCrud();
  const { mode, setMode } = useEditorMode();
  const { isOpen, openModal, closeModal } = useDeleteModal();

  const handleConfirmDelete = useCallback(async (): Promise<void> => {
    if (!selectedNote) return;

    try {
      await removeNote(selectedNote.id);
      closeModal();
      setMode('view');
      notifications.show({
        title: DELETE_SUCCESS_TITLE,
        message: DELETE_SUCCESS_MESSAGE,
        color: 'green',
      });
    } catch {
      notifications.show({
        title: DELETE_ERROR_TITLE,
        message: DELETE_ERROR_MESSAGE,
        color: 'red',
      });
    }
  }, [selectedNote, removeNote, closeModal, setMode]);

  return (
    <>
      {!selectedNote && <NoteViewerEmptyState />}
      {selectedNote && (
        <Stack gap="md">
          <NoteHeader mode={mode} onModeChange={setMode} onDelete={openModal} />
          {mode === 'view' && <NoteViewer />}
          {mode === 'edit' && <NoteEditor />}
        </Stack>
      )}
      <DeleteConfirm
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        noteTitle={selectedNote?.title || ''}
      />
    </>
  );
};

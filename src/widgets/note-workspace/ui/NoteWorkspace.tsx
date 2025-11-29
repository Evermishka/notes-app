import { useCallback } from 'react';
import { Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useSelectedNote, useNoteDispatch } from '@/entities/note';
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
  const selectedNote = useSelectedNote();
  const { actions } = useNoteDispatch();
  const { state: editorState, setMode } = useEditorMode();
  const { isOpen, openModal, closeModal } = useDeleteModal();

  const handleConfirmDelete = useCallback(async (): Promise<void> => {
    if (!selectedNote) return;

    try {
      await actions.delete(selectedNote.id);
      closeModal();
      setMode('view');
      notifications.show({
        title: DELETE_SUCCESS_TITLE,
        message: DELETE_SUCCESS_MESSAGE,
        color: 'secondary',
      });
    } catch {
      notifications.show({
        title: DELETE_ERROR_TITLE,
        message: DELETE_ERROR_MESSAGE,
        color: 'danger',
      });
    }
  }, [selectedNote, actions, closeModal, setMode]);

  return (
    <>
      {!selectedNote && <NoteViewerEmptyState />}
      {selectedNote && (
        <Stack gap="md">
          <NoteHeader mode={editorState.mode} onModeChange={setMode} onDelete={openModal} />
          {editorState.mode === 'view' && <NoteViewer />}
          {editorState.mode === 'edit' && <NoteEditor />}
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

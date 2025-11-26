import { useNotesSelectors } from '@/features/notes-crud';
import { Stack } from '@mantine/core';
import { useViewEditorContext } from '../model';
import { NoteEditor } from './NoteEditor';
import { NoteHeader } from './NoteHeader';
import { NoteViewer } from './NoteViewer';
import { NoteViewerEmptyState } from './NoteViewerEmptyState';

export const NoteWorkspace = () => {
  const { mode } = useViewEditorContext();
  const { currentSelectedNote } = useNotesSelectors();

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
    </>
  );
};

import { Text, Stack } from '@mantine/core';
import { useNoteStore, selectSelectedNote } from '@/entities/note';
import { NOTE_EMPTY_VIEW_TEXT } from '@/shared/config';

export const NoteViewerEmptyState = () => {
  const { state } = useNoteStore();
  const selectedNote = selectSelectedNote(state);

  if (selectedNote === null) {
    return (
      <Stack align="center" justify="center" h="100%">
        <Text size="lg" ta="center">
          {NOTE_EMPTY_VIEW_TEXT}
        </Text>
      </Stack>
    );
  }

  return null;
};

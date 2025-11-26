import { Text, Stack } from '@mantine/core';
import { useNotesSelectors } from '@/features/notes-crud';
import { NOTE_EMPTY_VIEW_TEXT } from '@/shared/config';

export const NoteViewerEmptyState = () => {
  const { currentSelectedNote } = useNotesSelectors();

  if (currentSelectedNote === null) {
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

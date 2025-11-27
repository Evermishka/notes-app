import { Text, Stack } from '@mantine/core';
import { useNoteState } from '@/entities/note';
import { NOTE_EMPTY_VIEW_TEXT, SIZES } from '@/shared/config';

export const NoteViewerEmptyState = () => {
  const state = useNoteState();

  if (state.selectedNote === null) {
    return (
      <Stack
        align="center"
        justify="center"
        h={`calc(100vh - ${SIZES.headerHeight}px)`}
        w="100%"
        style={{ margin: 'calc(var(--mantine-spacing-md) * -1)' }}
      >
        <Text size="xl" ta="center" style={{ fontWeight: 600 }}>
          {NOTE_EMPTY_VIEW_TEXT}
        </Text>
      </Stack>
    );
  }

  return null;
};

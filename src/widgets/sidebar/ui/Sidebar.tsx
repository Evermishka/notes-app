import { Box } from '@mantine/core';
import { NotesList } from '@/features/notes-crud';
import { ActionPanel } from '../../action-panel';

export const Sidebar = () => {
  return (
    <Box>
      <ActionPanel />
      <NotesList />
    </Box>
  );
};

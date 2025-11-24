import { Box, Text } from '@mantine/core';
import { NotesList } from '../../../features/notes-crud/ui/NotesList';

export const Sidebar = () => {
  return (
    <Box>
      <Text size="lg" fw={500} mb="md">
        Заметки
      </Text>
      <NotesList />
    </Box>
  );
};

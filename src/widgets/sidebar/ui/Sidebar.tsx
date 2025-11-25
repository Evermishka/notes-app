import { NotesList } from '@/features/notes-crud';
import { Box, Text } from '@mantine/core';

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

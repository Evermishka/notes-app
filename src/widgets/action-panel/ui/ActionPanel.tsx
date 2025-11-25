import React from 'react';
import { Stack } from '@mantine/core';
import { AddNoteButton } from '@/features/notes-crud';

export const ActionPanel: React.FC = () => {
  return (
    <Stack gap="lg" w="100%" p="md">
      <AddNoteButton />
    </Stack>
  );
};

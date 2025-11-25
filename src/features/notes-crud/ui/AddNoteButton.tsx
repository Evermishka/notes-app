import React, { useCallback, useEffect } from 'react';
import { Button, Stack } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNotesContext } from '@/features/notes-crud';

// Константы для строк
const ADD_BUTTON_TEXT = 'Новая заметка';
const ERROR_TITLE = 'Ошибка';
const ERROR_MESSAGE = 'Не удалось добавить заметку';

export const AddNoteButton: React.FC = () => {
  const { loading, error, addNote } = useNotesContext();

  useEffect(() => {
    if (error) {
      notifications.show({ title: ERROR_TITLE, message: error });
    }
  }, [error]);

  const handleAdd = useCallback(async (): Promise<void> => {
    const now = new Date();
    const formattedDate = now.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Moscow',
    });
    const title = `Новая заметка ${formattedDate}`;
    const content = '';
    try {
      await addNote(title, content);
    } catch {
      notifications.show({ title: ERROR_TITLE, message: ERROR_MESSAGE });
    }
  }, [addNote]);

  return (
    <Stack gap="lg" p="md">
      <Button leftSection={<PlusIcon width={16} />} onClick={handleAdd} loading={loading} fullWidth>
        {ADD_BUTTON_TEXT}
      </Button>
    </Stack>
  );
};

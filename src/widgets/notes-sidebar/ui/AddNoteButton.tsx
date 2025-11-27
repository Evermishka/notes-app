import React, { useCallback, useEffect } from 'react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNoteStore, selectLoading, selectError } from '@/entities/note';
import { useNoteCrud } from '@/features/note-crud';
import { formatDate } from '@/shared/utils/text-utils';
import { ERROR_TITLE, ERROR_MESSAGE, ADD_BUTTON_TEXT } from '@/shared/config';

interface AddNoteButtonProps {
  onNoteAdded?: () => void;
}

export const AddNoteButton: React.FC<AddNoteButtonProps> = ({ onNoteAdded }) => {
  const { state } = useNoteStore();
  const loading = selectLoading(state);
  const error = selectError(state);
  const { addNote } = useNoteCrud();

  useEffect(() => {
    if (error) {
      notifications.show({ title: ERROR_TITLE, message: error });
    }
  }, [error]);

  const handleAdd = useCallback(async (): Promise<void> => {
    const now = new Date();
    const formattedDate = formatDate(now);
    const title = `Новая заметка ${formattedDate}`;
    const content = '';
    try {
      await addNote(title, content);
      onNoteAdded?.();
    } catch {
      notifications.show({ title: ERROR_TITLE, message: ERROR_MESSAGE });
    }
  }, [addNote, onNoteAdded]);

  return (
    <Button
      leftSection={<PlusIcon width={16} />}
      onClick={handleAdd}
      loading={loading}
      fullWidth
      p="sm"
      h="40px"
    >
      {ADD_BUTTON_TEXT}
    </Button>
  );
};

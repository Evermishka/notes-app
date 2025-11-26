import React, { useCallback, useEffect } from 'react';
import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useNotesContext } from '@/features/notes-crud';
import { useViewEditorContext } from '@/features/notes-view-editor';
import { formatDate } from '@/shared/utils/text-utils';
import { ERROR_TITLE, ERROR_MESSAGE, ADD_BUTTON_TEXT } from '@/shared/config';

export const AddNoteButton: React.FC = () => {
  const { loading, error, addNote } = useNotesContext();
  const { setMode } = useViewEditorContext();

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
      setMode('edit');
    } catch {
      notifications.show({ title: ERROR_TITLE, message: ERROR_MESSAGE });
    }
  }, [addNote, setMode]);

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

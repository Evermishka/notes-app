import { useCallback } from 'react';
import { Group, Button, Tooltip, Title, TextInput } from '@mantine/core';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNoteStore, selectSelectedNote } from '@/entities/note';
import { useNoteCrud } from '@/features/note-crud';
import { SIZES } from '@/shared/config';

interface NoteHeaderProps {
  mode: 'view' | 'edit';
  onModeChange: (mode: 'view' | 'edit') => void;
  onDelete: () => void;
}

export const NoteHeader = ({ mode, onModeChange, onDelete }: NoteHeaderProps) => {
  const { state } = useNoteStore();
  const selectedNote = selectSelectedNote(state);
  const { editNote } = useNoteCrud();

  const handleEdit = useCallback((): void => {
    onModeChange('edit');
  }, [onModeChange]);

  const handleView = useCallback((): void => {
    onModeChange('view');
  }, [onModeChange]);

  const handleDelete = useCallback((): void => {
    onDelete();
  }, [onDelete]);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = event.currentTarget.value;
      if (selectedNote) {
        editNote(selectedNote.id, newTitle, selectedNote.content);
      }
    },
    [selectedNote, editNote]
  );

  if (!selectedNote) {
    return null;
  }

  return (
    <Group justify="space-between" align="center">
      {mode === 'view' && <Title order={1}>{selectedNote.title}</Title>}
      {mode === 'edit' && (
        <TextInput
          key={selectedNote.id}
          defaultValue={selectedNote.title}
          onChange={handleTitleChange}
          size="xl"
          style={{ flex: 1 }}
        />
      )}
      <Group gap="xs">
        {mode === 'view' && (
          <Tooltip label="Редактировать">
            <Button
              variant="subtle"
              size="sm"
              onClick={handleEdit}
              aria-label="Редактировать заметку"
            >
              <PencilSquareIcon width={SIZES.iconWidth} height={SIZES.iconHeight} />
            </Button>
          </Tooltip>
        )}
        {mode === 'edit' && (
          <Tooltip label="Просмотреть">
            <Button
              variant="subtle"
              size="sm"
              onClick={handleView}
              aria-label="Просмотреть заметку"
            >
              <EyeIcon width={SIZES.iconWidth} height={SIZES.iconHeight} />
            </Button>
          </Tooltip>
        )}
        <Tooltip label="Удалить">
          <Button variant="subtle" size="sm" onClick={handleDelete} aria-label="Удалить заметку">
            <TrashIcon width={SIZES.iconWidth} height={SIZES.iconHeight} />
          </Button>
        </Tooltip>
      </Group>
    </Group>
  );
};

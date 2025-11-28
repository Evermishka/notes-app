import { useCallback } from 'react';
import { Group, Button, Tooltip, Title, Text, TextInput } from '@mantine/core';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNoteStore } from '@/entities/note';
import { SIZES } from '@/shared/config';
import { getNoteSyncMeta } from '@/entities/note/model/sync-status';

interface NoteHeaderProps {
  mode: 'view' | 'edit';
  onModeChange: (mode: 'view' | 'edit') => void;
  onDelete: () => void;
}

export const NoteHeader = ({ mode, onModeChange, onDelete }: NoteHeaderProps) => {
  const { state, actions } = useNoteStore();

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
      if (state.selectedNote) {
        actions.update(state.selectedNote.id, newTitle, state.selectedNote.content);
      }
    },
    [state.selectedNote, actions]
  );

  if (!state.selectedNote) {
    return null;
  }

  const selectedNote = state.selectedNote;
  const { text: statusMessage, color: statusColor } = getNoteSyncMeta(selectedNote);

  return (
    <Group justify="space-between" align="center">
      <div style={{ flex: 1, minWidth: 0 }}>
        {mode === 'view' && (
          <>
            <Title order={1}>{selectedNote.title}</Title>
            <Text size="sm" c={statusColor}>
              {statusMessage}
            </Text>
          </>
        )}
        {mode === 'edit' && (
          <>
            <TextInput
              key={selectedNote.id}
              defaultValue={selectedNote.title}
              onChange={handleTitleChange}
              size="xl"
              style={{ flex: 1 }}
            />
            <Text size="sm" c={statusColor}>
              {statusMessage}
            </Text>
          </>
        )}
      </div>
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

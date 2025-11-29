import { useCallback } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import { Group, Button, Tooltip, Title, Text, TextInput, Menu, ActionIcon } from '@mantine/core';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useNoteStore } from '@/entities/note';
import { ICON_SIZE } from '@/shared/config';
import { getNoteSyncMeta } from '@/entities/note/model/sync-status';

interface NoteHeaderProps {
  mode: 'view' | 'edit';
  onModeChange: (mode: 'view' | 'edit') => void;
  onDelete: () => void;
}

export const NoteHeader = ({ mode, onModeChange, onDelete }: NoteHeaderProps) => {
  const { state, actions } = useNoteStore();
  const isMobile = useMediaQuery('(max-width: 640px)');

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
      {isMobile ? (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="lg" aria-label="Действия с заметкой">
              <EllipsisVerticalIcon width={ICON_SIZE} height={ICON_SIZE} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {mode === 'view' && (
              <Menu.Item
                leftSection={<PencilSquareIcon width={ICON_SIZE} height={ICON_SIZE} />}
                onClick={handleEdit}
              >
                Редактировать
              </Menu.Item>
            )}
            {mode === 'edit' && (
              <Menu.Item
                leftSection={<EyeIcon width={ICON_SIZE} height={ICON_SIZE} />}
                onClick={handleView}
              >
                Просмотреть
              </Menu.Item>
            )}
            <Menu.Divider />
            <Menu.Item
              leftSection={<TrashIcon width={ICON_SIZE} height={ICON_SIZE} />}
              onClick={handleDelete}
              color="red"
            >
              Удалить
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        <Group gap="xs">
          {mode === 'view' && (
            <Tooltip label="Редактировать">
              <Button
                variant="subtle"
                size="sm"
                onClick={handleEdit}
                aria-label="Редактировать заметку"
              >
                <PencilSquareIcon width={ICON_SIZE} height={ICON_SIZE} />
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
                <EyeIcon width={ICON_SIZE} height={ICON_SIZE} />
              </Button>
            </Tooltip>
          )}
          <Tooltip label="Удалить">
            <Button variant="subtle" size="sm" onClick={handleDelete} aria-label="Удалить заметку">
              <TrashIcon width={ICON_SIZE} height={ICON_SIZE} />
            </Button>
          </Tooltip>
        </Group>
      )}
    </Group>
  );
};

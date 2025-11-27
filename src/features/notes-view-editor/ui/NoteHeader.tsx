import { useCallback } from 'react';
import { Group, Button, Tooltip, Title, TextInput } from '@mantine/core';
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNotesSelectors } from '@/features/notes-crud/model/use-notes-selectors';
import { useViewEditorContext } from '../model/use-view-editor-context';
import { SIZES } from '@/shared/config';

export const NoteHeader = () => {
  const { mode, setMode, openDeleteModal } = useViewEditorContext();
  const { currentSelectedNote } = useNotesSelectors();

  // [Открытие модального окна подтверждения удаления]
  const handleDelete = useCallback((): void => {
    openDeleteModal();
  }, [openDeleteModal]);

  const handleEdit = (): void => {
    setMode('edit');
  };

  const handleCancel = (): void => {
    setMode('view');
  };

  if (!currentSelectedNote) {
    return null;
  }

  return (
    <Group justify="space-between" align="center">
      {mode === 'view' && <Title order={1}>{currentSelectedNote.title}</Title>}
      {mode === 'edit' && (
        <TextInput value={currentSelectedNote.title} size="xl" style={{ flex: 1 }} />
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
              onClick={handleCancel}
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

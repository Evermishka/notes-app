import { Modal, Button, Text, Group } from '@mantine/core';
import {
  DELETE_MODAL_TITLE,
  DELETE_MODAL_CONFIRM_TEXT,
  DELETE_BUTTON_CANCEL,
  DELETE_BUTTON_CONFIRM,
} from '@/shared/config';

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  noteTitle: string;
}

export const DeleteConfirm = ({ isOpen, onClose, onConfirm, noteTitle }: DeleteConfirmProps) => {
  return (
    <Modal opened={isOpen} onClose={onClose} title={DELETE_MODAL_TITLE} centered>
      <Text size="sm" mb="md">
        {DELETE_MODAL_CONFIRM_TEXT(noteTitle)}
      </Text>
      <Group justify="flex-end" gap="xs">
        <Button variant="default" onClick={onClose}>
          {DELETE_BUTTON_CANCEL}
        </Button>
        <Button variant="filled" color="danger" onClick={onConfirm}>
          {DELETE_BUTTON_CONFIRM}
        </Button>
      </Group>
    </Modal>
  );
};

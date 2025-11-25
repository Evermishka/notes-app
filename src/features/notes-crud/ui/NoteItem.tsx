import React, { useCallback, forwardRef } from 'react';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import type { Note } from '@/entities/note';
import { truncateTitle, truncateContent, formatDate } from '@/shared/utils';
import { SELECTED_BACKGROUND, SELECTED_BORDER, HOVER_BACKGROUND } from '@/shared/config';

interface NoteItemProps {
  id: string;
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEscape?: () => void;
}

export const NoteItem = forwardRef<HTMLButtonElement, NoteItemProps>(
  ({ note, isSelected, onClick, onArrowUp, onArrowDown, onEscape }, ref) => {
    const handleClick = useCallback(() => {
      onClick();
    }, [onClick]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          onArrowUp?.();
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          onArrowDown?.();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          onEscape?.();
        }
      },
      [onClick, onArrowUp, onArrowDown, onEscape]
    );

    const truncatedTitle = truncateTitle(note.title);
    const truncatedContent = truncateContent(note.content);

    const formattedDate = formatDate(note.updatedAt);

    return (
      <UnstyledButton
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: isSelected ? SELECTED_BACKGROUND : 'transparent',
          border: `1px solid ${isSelected ? SELECTED_BORDER : 'transparent'}`,
          textAlign: 'left',
          display: 'block',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = HOVER_BACKGROUND;
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
        }}
        aria-label={`Выбрать заметку: ${note.title}`}
        role="option"
        aria-selected={isSelected}
      >
        <Flex gap="xs" align="flex-start" wrap="nowrap">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text size="md" fw={600} lineClamp={1} title={note.title} mb="xs">
              {truncatedTitle}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={2} title={note.content} mb="xs">
              {truncatedContent}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1} title={note.updatedAt}>
              {formattedDate}
            </Text>
          </div>
        </Flex>
      </UnstyledButton>
    );
  }
);

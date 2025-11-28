import React, { useCallback, forwardRef } from 'react';
import { Flex, Text, UnstyledButton } from '@mantine/core';
import type { Note } from '@/entities/note';
import { getNoteSyncMeta } from '@/entities/note/model/sync-status';
import { truncateTitle, truncateContent, formatDate } from '@/shared/utils';
import {
  SELECTED_BACKGROUND,
  SELECTED_BORDER,
  HOVER_BACKGROUND,
  NOTE_ITEM_PADDING,
  NOTE_ITEM_BORDER_RADIUS,
  NOTE_ITEM_TITLE_SIZE,
  NOTE_ITEM_TITLE_WEIGHT,
  NOTE_ITEM_LINE_CLAMP_TITLE,
  NOTE_ITEM_CONTENT_SIZE,
  NOTE_ITEM_LINE_CLAMP_CONTENT,
  NOTE_ITEM_DATE_SIZE,
  NOTE_ITEM_LINE_CLAMP_DATE,
  NOTE_ITEM_TEXT_MARGIN,
  NOTE_ITEM_STACK_GAP,
} from '@/shared/config';

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
    const { text: statusText, color: statusColor } = getNoteSyncMeta(note);

    return (
      <UnstyledButton
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        style={{
          width: '100%',
          padding: NOTE_ITEM_PADDING,
          borderRadius: NOTE_ITEM_BORDER_RADIUS,
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
        <Flex gap={NOTE_ITEM_STACK_GAP} align="flex-start" wrap="nowrap">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text
              size={NOTE_ITEM_TITLE_SIZE}
              fw={NOTE_ITEM_TITLE_WEIGHT}
              lineClamp={NOTE_ITEM_LINE_CLAMP_TITLE}
              title={note.title}
              mb={NOTE_ITEM_TEXT_MARGIN}
            >
              {truncatedTitle}
            </Text>
            <Text
              size={NOTE_ITEM_CONTENT_SIZE}
              c="dimmed"
              lineClamp={NOTE_ITEM_LINE_CLAMP_CONTENT}
              title={note.content}
              mb={NOTE_ITEM_TEXT_MARGIN}
            >
              {truncatedContent}
            </Text>
            <Text
              size={NOTE_ITEM_DATE_SIZE}
              c="dimmed"
              lineClamp={NOTE_ITEM_LINE_CLAMP_DATE}
              title={note.updatedAt}
            >
              {formattedDate}
            </Text>
            <Text size="xs" c={statusColor} lineClamp={1}>
              {statusText}
            </Text>
          </div>
        </Flex>
      </UnstyledButton>
    );
  }
);

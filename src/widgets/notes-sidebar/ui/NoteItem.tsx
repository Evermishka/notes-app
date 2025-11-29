import React, { useCallback, forwardRef, memo } from 'react';
import { Flex, Text, UnstyledButton, Tooltip } from '@mantine/core';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { Note } from '@/entities/note';
import { getNoteSyncMeta } from '@/entities/note/model/sync-status';
import { truncateTitle, truncateContent, formatDate } from '@/shared/utils';
import {
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

const NoteItemComponent = forwardRef<HTMLButtonElement, NoteItemProps>(
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
    const hasSyncError = Boolean(note.syncError);
    const isSynced = note.synced !== false;
    const shouldShowStatusIcon = hasSyncError || !isSynced;

    return (
      <UnstyledButton
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className={`note-item ${isSelected ? 'selected' : ''}`}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                marginTop: 4,
              }}
            >
              <Text
                size={NOTE_ITEM_DATE_SIZE}
                c="dimmed"
                lineClamp={NOTE_ITEM_LINE_CLAMP_DATE}
                title={note.updatedAt}
                style={{ flex: 1 }}
              >
                {formattedDate}
              </Text>
              {shouldShowStatusIcon && (
                <Tooltip label={statusText} position="top" withArrow>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                    }}
                  >
                    {statusColor === 'danger' && (
                      <ExclamationTriangleIcon
                        width={16}
                        height={16}
                        color="var(--mantine-color-red-6)"
                      />
                    )}
                    {statusColor === 'primary' && (
                      <ClockIcon
                        width={16}
                        height={16}
                        color="var(--mantine-color-blue-6)"
                        className="sync-pending-pulse"
                      />
                    )}
                    {statusColor === 'secondary' && (
                      <CheckCircleIcon
                        width={16}
                        height={16}
                        color="var(--mantine-color-green-6)"
                      />
                    )}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        </Flex>
      </UnstyledButton>
    );
  }
);

export const NoteItem = memo(NoteItemComponent);

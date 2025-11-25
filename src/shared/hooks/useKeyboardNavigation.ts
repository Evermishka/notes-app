import { useCallback } from 'react';
import type { Note } from '@/entities/note';

export const useKeyboardNavigation = ({
  refs,
  length,
  currentIndex,
  setSelectedItem,
  allItems,
}: {
  refs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  length: number;
  currentIndex: number;
  setSelectedItem: (note: Note | null) => void;
  allItems: Note[];
}) => {
  const handleArrowUp = useCallback(() => {
    const prevIndex = (currentIndex - 1 + length) % length;
    setSelectedItem(allItems[prevIndex]);
    refs.current[prevIndex]?.focus();
  }, [length, currentIndex, setSelectedItem, allItems, refs]);

  const handleArrowDown = useCallback(() => {
    const nextIndex = (currentIndex + 1) % length;
    setSelectedItem(allItems[nextIndex]);
    refs.current[nextIndex]?.focus();
  }, [length, currentIndex, setSelectedItem, allItems, refs]);

  return { handleArrowUp, handleArrowDown };
};

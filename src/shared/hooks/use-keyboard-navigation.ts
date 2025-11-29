import { useCallback, useState, useEffect } from 'react';
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

// Хук для оптимизированных медиа-запросов
export const useBreakpoint = () => {
  const [isTiny, setIsTiny] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      setIsTiny(width <= 350);
      setIsMobile(width <= 480);
      setIsTablet(width <= 768);
      setIsDesktop(width > 768);
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    return () => window.removeEventListener('resize', updateBreakpoints);
  }, []);

  return { isTiny, isMobile, isTablet, isDesktop };
};

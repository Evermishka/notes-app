import { useState, useMemo } from 'react';
import { useNotesList } from '@/entities/note';
import type { Note } from '@/entities/note';

export const useNoteSearch = () => {
  const allNotes = useNotesList();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allNotes;
    }

    const query = searchQuery.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [allNotes, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredNotes,
  };
};

// Устаревшая функция, оставлена для обратной совместимости
// Рекомендуется использовать useNoteSearch
export const useFilteredNotes = (allNotes: Note[], searchQuery: string) => {
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return allNotes;
    }

    const query = searchQuery.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [allNotes, searchQuery]);

  return filteredNotes;
};

import { useMemo } from 'react';
import type { Note } from '@/entities/note';

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

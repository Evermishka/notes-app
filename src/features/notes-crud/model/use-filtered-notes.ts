import { useMemo } from 'react';
import { useNotesSelectors } from './use-notes-selectors';

export const useFilteredNotes = () => {
  const { allNotes, currentSearchQuery } = useNotesSelectors();

  const filteredNotes = useMemo(() => {
    if (!currentSearchQuery.trim()) {
      return allNotes;
    }

    const query = currentSearchQuery.toLowerCase();
    return allNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
    );
  }, [allNotes, currentSearchQuery]);

  return filteredNotes;
};

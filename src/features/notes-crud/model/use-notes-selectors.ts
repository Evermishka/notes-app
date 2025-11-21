import { useMemo } from 'react';
import { useNotesContext } from './use-notes-context';

export const useNotesSelectors = () => {
  const { notes, loading, error, selectedNote, searchQuery } = useNotesContext();

  const allNotes = useMemo(() => notes, [notes]);
  const isLoading = useMemo(() => loading, [loading]);
  const currentError = useMemo(() => error, [error]);
  const currentSelectedNote = useMemo(() => selectedNote, [selectedNote]);
  const currentSearchQuery = useMemo(() => searchQuery, [searchQuery]);

  const notesCount = useMemo(() => notes.length, [notes.length]);

  return {
    allNotes,
    isLoading,
    currentError,
    currentSelectedNote,
    currentSearchQuery,
    notesCount,
  };
};

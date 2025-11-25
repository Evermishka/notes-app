import { useState, useCallback } from 'react';
import { TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useNotesContext } from '../model';

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState<string>('');
  const { setSearchQuery } = useNotesContext();

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => setSearchQuery(value), {
    delay: 300,
    flushOnUnmount: true,
  });

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setSearchInput(value);
      debouncedSetSearchQuery(value);
    },
    [debouncedSetSearchQuery]
  );

  return (
    <TextInput placeholder="Поиск" value={searchInput} onChange={handleChange} aria-label="Поиск" />
  );
};

import { useState, useCallback } from 'react';
import { TextInput } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';

interface SearchBarProps {
  onSearchChange: (query: string) => void;
}

export const SearchBar = ({ onSearchChange }: SearchBarProps) => {
  const [searchInput, setSearchInput] = useState<string>('');

  const debouncedSetSearchQuery = useDebouncedCallback((value: string) => onSearchChange(value), {
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

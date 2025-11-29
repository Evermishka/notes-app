import { useState, useCallback } from 'react';
import { TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SEARCH_PLACEHOLDER, SEARCH_ARIA_LABEL, ICON_SIZE } from '@/shared/config';
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
    <TextInput
      placeholder={SEARCH_PLACEHOLDER}
      value={searchInput}
      onChange={handleChange}
      aria-label={SEARCH_ARIA_LABEL}
      leftSection={<MagnifyingGlassIcon width={ICON_SIZE} height={ICON_SIZE} />}
    />
  );
};

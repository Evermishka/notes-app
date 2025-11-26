import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readLocalStorageValue } from '@mantine/hooks';
import { Text } from '@mantine/core';
import { useNotesContext } from '@/features/notes-crud';
import { SimpleMdeReact } from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

export const NoteEditor = () => {
  const { selectedNote, editNote } = useNotesContext();
  const [content, setContent] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mdeRef = useRef<any>(null);

  // Только при монтировании компонента
  useEffect(() => {
    if (content === '') {
      const initialValue =
        selectedNote?.content || readLocalStorageValue({ key: 'notes-app' }) || '';
      setContent(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновление содержания при смене выбранной заметки
  useEffect(() => {
    const newContent = selectedNote?.content || '';
    setContent(newContent);
    if (mdeRef.current) {
      mdeRef.current.value(newContent);
    }
  }, [selectedNote]);

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
      if (selectedNote) {
        editNote(selectedNote.id, selectedNote.title, value);
      }
    },
    [editNote, selectedNote]
  );

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      autosave: {
        enabled: true,
        uniqueId: 'notes-app',
        delay: 1000,
      },
    };
  }, []);

  if (content === null) return <Text>Загрузка редактора...</Text>;

  return (
    <div className="note-editor">
      <SimpleMdeReact value={content} onChange={handleChange} options={options} />
    </div>
  );
};

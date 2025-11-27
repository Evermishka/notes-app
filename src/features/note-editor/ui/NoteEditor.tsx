import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readLocalStorageValue } from '@mantine/hooks';
import { Text } from '@mantine/core';
import { SimpleMdeReact } from 'react-simplemde-editor';
import { useNoteStore, selectSelectedNote } from '@/entities/note';
import { useNoteCrud } from '@/features/note-crud';
import 'easymde/dist/easymde.min.css';

export const NoteEditor = () => {
  const { state } = useNoteStore();
  const selectedNote = selectSelectedNote(state);
  const { editNote } = useNoteCrud();
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

  if (!selectedNote) return <Text>Загрузка редактора...</Text>;

  return (
    <div className="note-editor">
      <SimpleMdeReact value={content} onChange={handleChange} options={options} />
    </div>
  );
};

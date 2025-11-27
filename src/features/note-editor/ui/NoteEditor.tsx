import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { readLocalStorageValue } from '@mantine/hooks';
import { Text } from '@mantine/core';
import { SimpleMdeReact } from 'react-simplemde-editor';
import { useNoteStore } from '@/entities/note';
import {
  NOTE_EDITOR_AUTOSAVE_DELAY,
  NOTE_EDITOR_AUTOSAVE_ID,
  NOTE_EDITOR_LOADING_TEXT,
  NOTE_EDITOR_STORAGE_KEY,
} from '@/shared/config';
import 'easymde/dist/easymde.min.css';

export const NoteEditor = () => {
  const { state, actions } = useNoteStore();
  const [content, setContent] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mdeRef = useRef<any>(null);

  // Только при монтировании компонента
  useEffect(() => {
    if (content === '') {
      const initialValue =
        state.selectedNote?.content ||
        readLocalStorageValue({ key: NOTE_EDITOR_STORAGE_KEY }) ||
        '';
      setContent(initialValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновление содержания при смене выбранной заметки
  useEffect(() => {
    const newContent = state.selectedNote?.content || '';
    setContent(newContent);
    if (mdeRef.current) {
      mdeRef.current.value(newContent);
    }
  }, [state.selectedNote]);

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
      if (state.selectedNote) {
        actions.update(state.selectedNote.id, state.selectedNote.title, value);
      }
    },
    [actions, state.selectedNote]
  );

  const options = useMemo(() => {
    return {
      autofocus: true,
      spellChecker: false,
      autosave: {
        enabled: true,
        uniqueId: NOTE_EDITOR_AUTOSAVE_ID,
        delay: NOTE_EDITOR_AUTOSAVE_DELAY,
      },
    };
  }, []);

  if (!state.selectedNote) return <Text>{NOTE_EDITOR_LOADING_TEXT}</Text>;

  return (
    <div className="note-editor">
      <SimpleMdeReact value={content} onChange={handleChange} options={options} />
    </div>
  );
};

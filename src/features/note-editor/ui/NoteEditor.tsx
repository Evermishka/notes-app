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
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContentRef = useRef<string>(content);
  const lastSavedContentRef = useRef<string>(content);
  const lastSelectedNoteIdRef = useRef<string | null>(null);
  const selectedNoteRef = useRef(state.selectedNote);

  // Только при монтировании компонента
  useEffect(() => {
    if (content === '') {
      const initialValue =
        state.selectedNote?.content ||
        readLocalStorageValue({ key: NOTE_EDITOR_STORAGE_KEY }) ||
        '';
      setContent(initialValue);
      pendingContentRef.current = initialValue;
      lastSavedContentRef.current = initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновление содержания при смене выбранной заметки
  useEffect(() => {
    selectedNoteRef.current = state.selectedNote;
    const note = state.selectedNote;
    const noteId = note?.id ?? null;

    if (lastSelectedNoteIdRef.current === noteId) {
      return;
    }

    lastSelectedNoteIdRef.current = noteId;
    const newContent = note?.content || '';
    setContent(newContent);
    pendingContentRef.current = newContent;
    lastSavedContentRef.current = newContent;

    if (mdeRef.current) {
      mdeRef.current.value(newContent);
    }
  }, [state.selectedNote]);

  const triggerSave = useCallback(async () => {
    const note = selectedNoteRef.current;
    if (!note || pendingContentRef.current === lastSavedContentRef.current) {
      return;
    }

    const contentToSave = pendingContentRef.current;
    try {
      await actions.update(note.id, note.title, contentToSave);
      lastSavedContentRef.current = contentToSave;
    } catch {
      // Ошибки уже обрабатываются в noteStore
    }
  }, [actions]);

  const flushPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    void triggerSave();
  }, [triggerSave]);

  useEffect(() => {
    return () => {
      flushPendingSave();
    };
  }, [flushPendingSave, state.selectedNote?.id]);

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
      pendingContentRef.current = value;
      if (!selectedNoteRef.current) {
        return;
      }

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        void triggerSave();
      }, NOTE_EDITOR_AUTOSAVE_DELAY);
    },
    [triggerSave]
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

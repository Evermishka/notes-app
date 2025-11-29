import { useCallback, useEffect, useMemo, useRef, useState, Suspense, lazy } from 'react';
import { readLocalStorageValue } from '@mantine/hooks';
import { Text } from '@mantine/core';
import { useSelectedNote, useNoteDispatch } from '@/entities/note';

// Lazy loading тяжелого редактора
const SimpleMdeReact = lazy(() =>
  import('react-simplemde-editor').then((module) => {
    // Динамическая загрузка CSS для редактора
    import('easymde/dist/easymde.min.css');
    return { default: module.SimpleMdeReact };
  })
);
import {
  NOTE_EDITOR_AUTOSAVE_DELAY,
  NOTE_EDITOR_AUTOSAVE_ID,
  NOTE_EDITOR_LOADING_TEXT,
  NOTE_EDITOR_STORAGE_KEY,
} from '@/shared/config';

export const NoteEditor = () => {
  const selectedNote = useSelectedNote();
  const { actions } = useNoteDispatch();
  const [content, setContent] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mdeRef = useRef<any>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingContentRef = useRef<string>(content);
  const lastSavedContentRef = useRef<string>(content);
  const lastSelectedNoteIdRef = useRef<string | null>(null);
  const selectedNoteRef = useRef(selectedNote);

  // Только при монтировании компонента
  useEffect(() => {
    if (content === '') {
      const initialValue =
        selectedNote?.content || readLocalStorageValue({ key: NOTE_EDITOR_STORAGE_KEY }) || '';
      setContent(initialValue);
      pendingContentRef.current = initialValue;
      lastSavedContentRef.current = initialValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Обновление содержания при смене выбранной заметки
  useEffect(() => {
    selectedNoteRef.current = selectedNote;
    const note = selectedNote;
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
  }, [selectedNote]);

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
  }, [flushPendingSave, selectedNote?.id]);

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

  if (!selectedNote) return <Text>{NOTE_EDITOR_LOADING_TEXT}</Text>;

  return (
    <div className="note-editor">
      <Suspense fallback={<Text>Загрузка редактора...</Text>}>
        <SimpleMdeReact value={content} onChange={handleChange} options={options} />
      </Suspense>
    </div>
  );
};

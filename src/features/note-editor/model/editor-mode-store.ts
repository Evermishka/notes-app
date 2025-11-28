import { createContext, useState, useCallback, useMemo, useContext } from 'react';
import type { EditorModeState, EditorModeContextType, ViewMode } from './types';

// Context
export const EditorModeContext = createContext<EditorModeContextType | undefined>(undefined);

// Публичный хук для компонентов
export const useEditorMode = (): EditorModeContextType => {
  const context = useContext(EditorModeContext);

  if (!context) {
    throw new Error(
      'useEditorMode должен быть использован внутри <EditorModeProvider>. ' +
        'Убедитесь, что ваше приложение обёрнуто в EditorModeProvider.'
    );
  }

  return context;
};

// Хук для создания значения контекста (используется в EditorModeProvider)
export const useEditorModeContext = () => {
  const [mode, setMode] = useState<ViewMode>('view');

  const state: EditorModeState = useMemo(
    () => ({
      mode,
    }),
    [mode]
  );

  // Actions
  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'view' ? 'edit' : 'view'));
  }, []);

  const setViewMode = useCallback(() => {
    setMode('view');
  }, []);

  const setEditMode = useCallback(() => {
    setMode('edit');
  }, []);

  return useMemo(
    () => ({
      state,
      setMode,
      toggleMode,
      setViewMode,
      setEditMode,
    }),
    [state, setMode, toggleMode, setViewMode, setEditMode]
  );
};

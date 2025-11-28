import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { EditorModeContext, type ViewMode } from './editor-mode-context';

export const NoteEditorModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ViewMode>('view');

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'view' ? 'edit' : 'view'));
  }, []);

  const setViewMode = useCallback(() => {
    setMode('view');
  }, []);

  const setEditMode = useCallback(() => {
    setMode('edit');
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode,
      setViewMode,
      setEditMode,
    }),
    [mode, setMode, toggleMode, setViewMode, setEditMode]
  );

  return <EditorModeContext.Provider value={value}>{children}</EditorModeContext.Provider>;
};

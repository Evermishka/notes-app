import { useState, useCallback } from 'react';

export type ViewMode = 'view' | 'edit';

export const useEditorMode = () => {
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

  return {
    mode,
    setMode,
    toggleMode,
    setViewMode,
    setEditMode,
  };
};

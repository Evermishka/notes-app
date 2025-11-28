import { useContext } from 'react';
import { EditorModeContext, type EditorModeContextValue } from './editor-mode-context';

export const useEditorMode = (): EditorModeContextValue => {
  const context = useContext(EditorModeContext);
  if (!context) {
    throw new Error('useEditorMode must be used within NoteEditorModeProvider');
  }
  return context;
};

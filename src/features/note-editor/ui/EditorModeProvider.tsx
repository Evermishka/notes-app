import { type ReactNode } from 'react';
import { EditorModeContext, useEditorModeContext } from '../model/editor-mode-store';

type EditorModeProviderProps = {
  children: ReactNode;
};

export const EditorModeProvider = ({ children }: EditorModeProviderProps) => {
  const value = useEditorModeContext();

  return <EditorModeContext.Provider value={value}>{children}</EditorModeContext.Provider>;
};

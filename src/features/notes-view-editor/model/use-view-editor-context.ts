import { useContext } from 'react';
import type { ViewEditorContextType } from './view-editor-types';
import { ViewEditorContext } from './view-editor-context';

export const useViewEditorContext = (): ViewEditorContextType => {
  const context = useContext(ViewEditorContext);
  if (!context) {
    throw new Error(
      'useViewEditorContext должен быть использован внутри <ViewEditorProvider>. ' +
        'Убедитесь, что ваше приложение обёрнуто в NotesProvider.'
    );
  }
  return context;
};

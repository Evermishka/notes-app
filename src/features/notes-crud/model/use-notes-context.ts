import { useContext } from 'react';
import { NotesContext } from './notes-context';
import type { NotesContextType } from './notes-types';

export const useNotesContext = (): NotesContextType => {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error(
      'useNotesContext должен быть использован внутри <NotesProvider>. ' +
        'Убедитесь, что ваше приложение обёрнуто в NotesProvider.'
    );
  }

  return context;
};
